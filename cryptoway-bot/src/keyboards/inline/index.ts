import { InlineKeyboardMarkup } from "@grammyjs/types";
import { InlineKeyboard } from "grammy";
import { InlineKeyboardType } from "../../types/index.js";

class Keyboards {
    startRate(ctx: InlineKeyboardType):InlineKeyboardMarkup {
        return new InlineKeyboard()
            .text(ctx.t("base"), "base")
            .text(ctx.t("extended"), "extended").row()
            .url(ctx.t("viewList"), "https://cryptorank.io/ru");
    }
    startPercent(ctx: InlineKeyboardType):InlineKeyboardMarkup {
        return new InlineKeyboard()
            .text(ctx.t("percent-5"), "percent-5")
            .text(ctx.t("percent-10"), "percent-10")
            .text(ctx.t("percent-15"), "percent-15");
    }
    settingsOpen(ctx: InlineKeyboardType):InlineKeyboardMarkup {
        return new InlineKeyboard()
            .text(ctx.t("settingsTop"), "settingsTop").row()
            .text(ctx.t("settingsPercent"), "settingsPercent").row()
    }
}

export const inlineKeybords = new Keyboards()