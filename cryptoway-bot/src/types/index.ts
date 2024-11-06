import { Context, Api, SessionFlavor, CommandContext, CallbackQueryContext } from 'grammy';
import { I18nFlavor } from "@grammyjs/i18n";

export interface SessionData {
    type: string | RegExpMatchArray;
    percent: number
  }

export type ContextType = Context & I18nFlavor & SessionFlavor<SessionData>;

export type BotApiType = {
    api: Api 
};

export type InlineKeyboardType = CommandContext<ContextType> | CallbackQueryContext<ContextType>

export interface IUser {
    id: number,
    tg_user_id: number,
    tg_user_name: number,
    tg_user_lang: 'ru' | "en" | string
}

export interface IAssets {
    id: number,
    list: Array<string>,
    percent: number,
    user_id: number
}

export interface IFullUser extends IUser, IAssets {}

export interface ICoin {
    rank: number,
    key: string,
    name: string,
    hasFundingRounds: boolean,
    symbol: string,
    type: string,
    price: {
        USD: number,
        BTC: number,
        ETH: number,
    }
    histPrices: {
        '24H': {
            USD: number,
            BTC: number,
            ETH: number
        }
    }
}