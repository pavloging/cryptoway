import { Composer } from "grammy";
import { ContextType } from "../../types/index.js";
import { inlineKeybords } from "../../keyboards/inline/index.js";
import { DB } from "../../database/db.js";

export const composer = new Composer<ContextType>();

composer.command("start", async (ctx) => {
    try {
        ctx.deleteMessage()
        const username = ctx.message?.from.username || "user";
        const userId = ctx.message?.from.id;

        await ctx.reply(ctx.t("welcome", { username }), {
            parse_mode: "HTML",
        });

        await ctx.api.sendSticker(
            ctx.chat.id,
            "CAACAgIAAxkBAAEJ0HZkwCcDaERON_p7u1eSXqHJ3jJ8pgACiwEAAiteUwujYbxpJDSDUC8E"
        );

        const isAuth = await DB.query(`
            SELECT * FROM ${process.env.DB_SCHEMA}.users 
            WHERE "tg_user_id"=${userId}
            LIMIT 1
        `);

        if (isAuth.length !== 0) return ctx.reply(ctx.t("isAuth"));

        await ctx.reply(ctx.t("selectRate"), {
            parse_mode: "HTML",
            reply_markup: inlineKeybords.startRate(ctx),
        });
    } catch (error) {
        console.error(error);
    }
});
