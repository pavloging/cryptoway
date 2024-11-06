import "dotenv/config";
import axios from "axios";
import cron from "node-cron";
import { i18n } from "../plugins/i18n.js";
import { BotApiType, ICoin, IFullUser } from "../types/index.js";
import { DB } from "../database/db.js";

export const setCheckCoins = (bot: BotApiType) => {
    cron.schedule("* * * * *", async () => {
      
        // Получаем пользователей и все данные о них
        const users: Array<IFullUser> = await DB.query(`
          SELECT users.id, users.tg_user_id, users.tg_user_lang, assets.list, assets.percent 
          FROM ${process.env.DB_SCHEMA}.users AS users
          JOIN ${process.env.DB_SCHEMA}.assets AS assets ON users.id = assets.user_id;
        `);

        // Фильруем монеты чтобы получить все данные в одном запросе
        const uniqueCoins = Array.from(new Set(users.map((user) => user.list).flat()));
        const coins = await axios.get(`${process.env.URL_API}coins=${uniqueCoins}`);

        // Фильтруем монеты которые больше или меньше нашему фикс проценту
        const usersAlarm = users.map((user: IFullUser) => {
            const filteredCoins = coins.data
              .map((coin: ICoin) => {
                  const percentChange = ((coin.price.USD - coin.histPrices["24H"].USD) / coin.histPrices["24H"].USD) * 100;
                  if (Math.abs(percentChange) > user.percent) return { name: coin.name, percent: percentChange, previousPrice: coin.histPrices["24H"].USD, currentPrice: coin.price.USD };
              })
              .filter((coin: ICoin) => coin)

            return { id: user.tg_user_id, coins: filteredCoins, lang: user.tg_user_lang };
        });

        // Отправляем пользователям сообщения об изменении цены
        usersAlarm.forEach(user => {
          user.coins.forEach((coin: { name: string, percent: number, previousPrice: number, currentPrice: number }) => {
            const message = i18n.t(user.lang, "alarmPrice", { name: coin.name, percent: coin.percent, previousPrice: coin.previousPrice, currentPrice: coin.currentPrice, icon: coin.percent > 0 ? "🟢" : "🔴" })
            bot.api.sendMessage(user.id, message, { parse_mode: "HTML" });
          })
        })
    });
};
