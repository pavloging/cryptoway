import { Composer } from "grammy";
import { ContextType, ICoin } from "../../types/index.js";
import { DB } from "../../database/db.js";
import axios from "axios";

export const composer = new Composer<ContextType>();

composer.command("coins", async (ctx) => {
    try {
        ctx.deleteMessage()
        // TODO: Объеденить два запроса SQL в один
        const userId = ctx.from?.id;
        const user = await DB.query(`
            SELECT * FROM ${process.env.DB_SCHEMA}.users 
            WHERE "tg_user_id"=${userId}
            LIMIT 1
        `);

        const asset = await DB.query(`
            SELECT * FROM ${process.env.DB_SCHEMA}.assets 
            WHERE "user_id"=${user[0].id}
            LIMIT 1
        `);

        const paramCoins = asset[0].list.join(",")
        const response = await axios.get(`${process.env.URL_API}coins=${paramCoins}`)

        if(response.status !== 200) throw new Error("Failed request to server")

        const arr: Array<string> = [];
        response.data.forEach((item:ICoin, index:number) => {
            const string = `${process.env.URL_MARKET}${item.key}`
            const percentChange = ((item.price["USD"] - item.histPrices["24H"]["USD"]) / item.histPrices["24H"]["USD"]) * 100;
            const data = `${index+1}. <a href="${string}">${item.name}</a> - ${item.price["USD"].toFixed(3)}$ <i>${percentChange.toFixed(1)}%</i>`
            arr.push(data);
        });
        const mes = ctx.t('seeActive') + '\n' + arr.join("\n");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await ctx.reply(mes, { parse_mode: "HTML", disable_web_page_preview: true });
    } catch (error) {
        console.error(error);
    }
});
