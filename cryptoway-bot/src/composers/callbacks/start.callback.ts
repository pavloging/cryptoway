import "dotenv/config";
import { Composer } from "grammy";
import axios from "axios";
import { DB } from "../../database/db.js";
import { inlineKeybords } from "../../keyboards/inline/index.js";
import { ContextType, ICoin } from "../../types/index.js";

export const composer = new Composer<ContextType>();

composer.callbackQuery(["base", "extended"], async (ctx) => {
    try {
        const match = ctx.match;
        ctx.session.type = match;

        await ctx.answerCallbackQuery();
        await ctx.deleteMessage();

        const userId = ctx.update.callback_query.from.id;
        if (!userId) throw new Error("Not correct userId");
        const user = await DB.query(`
            SELECT * FROM ${process.env.DB_SCHEMA}.users 
            WHERE "tg_user_id"=$1
            LIMIT 1
        `,
        [userId]);

        // Create
        if (user.length === 0) {
            await ctx.reply(`Вы успешно выбрали набор: ${ctx.session.type} ✅`);
            await ctx.reply(ctx.t("selectPercent"), {
                parse_mode: "HTML",
                reply_markup: inlineKeybords.startPercent(ctx),
            });
        }

        // Update
        if (user.length !== 0) {
            let limit: number;
            const type = ctx.session.type;
            if (type === "base") limit = 5;
            else if (type === "extended") limit = 10;
            else throw new Error("Invalid session type");

            const { data } = await axios.get(
                `${process.env.URL_API}limitCoins=${limit!}`
            );
            if (!data) throw new Error();

            const list = data
                .filter((item: ICoin) => item.type === "coin")
                .map((item: ICoin) => item.key)
                .slice(0, limit);

            const userId = ctx.update.callback_query.from.id;
            if (!userId) throw new Error("Not correct userId");

            const update = await DB.query(
                `
                UPDATE ${process.env.DB_SCHEMA}.assets 
                SET list = $1
                WHERE "user_id" = $2
            `,
                [list, user[0].id]
            );
            if (!update) throw new Error();

            await ctx.reply(`Вы успешно выбрали набор: ${ctx.session.type} ✅`);
        }
    } catch (error) {
        ctx.reply(ctx.t("error"));
        console.error(error);
    }
});

composer.callbackQuery(
    ["percent-5", "percent-10", "percent-15"],
    async (ctx) => {
        try {
            if (ctx.match === "percent-5") ctx.session.percent = 5;
            if (ctx.match === "percent-10") ctx.session.percent = 10;
            if (ctx.match === "percent-15") ctx.session.percent = 15;

            await ctx.answerCallbackQuery();
            await ctx.deleteMessage();

            const percent = ctx.session.percent;
            await ctx.reply(ctx.t("successPercent", { percent }));

            let limit: number;
            const type = ctx.session.type;
            if (type === "base") limit = 5;
            else if (type === "extended") limit = 10;
            else throw new Error("Invalid session type");

            const { data } = await axios.get(`${process.env.URL_API}limitCoins=${limit!}`);

            const list = data
                .filter((item: ICoin) => item.type === "coin")
                .map((item: ICoin) => item.key)
                .slice(0, limit);

            const username = ctx.update.callback_query.from.username || "user";
            const userId = ctx.update.callback_query.from.id;
            if (!userId) throw new Error("Not correct userId");

            const user = await DB.query(`
                SELECT * FROM ${process.env.DB_SCHEMA}.users 
                WHERE "tg_user_id"=$1
                LIMIT 1
            `,
            [userId]);
            
            // Create
            if (user.length === 0) {
                const newUser = await DB.query(`
                    INSERT INTO ${process.env.DB_SCHEMA}.users (tg_user_id, tg_user_name, tg_user_lang)
                    VALUES ($1, $2, $3) RETURNING *
                `,
                [userId, username, await ctx.i18n.getLocale()]);

                const newAssets = await DB.query(`
                    INSERT INTO ${process.env.DB_SCHEMA}.assets (list, percent, user_id)
                    VALUES ($1, $2, $3) RETURNING *
                `,
                [list, ctx.session.percent, newUser[0].id]);
                if (!newAssets)
                    throw new Error("Not found assets, start command");
            }
            // Update
            if (user.length !== 0) {
                await DB.query(`
                    UPDATE ${process.env.DB_SCHEMA}.assets 
                    SET percent = ${percent}
                    WHERE "user_id"=${user[0].id}
                `);
            }
            ctx.reply(ctx.t("successWorking"));
        } catch (error) {
            ctx.reply(ctx.t("error"));
            console.error(error);
        }
    }
);
