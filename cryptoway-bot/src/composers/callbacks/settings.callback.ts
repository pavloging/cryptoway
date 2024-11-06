import "dotenv/config";
import { Composer } from "grammy";
import { ContextType } from "../../types/index.js";
import { inlineKeybords } from "../../keyboards/inline/index.js";

export const composer = new Composer<ContextType>();

composer.callbackQuery("settingsTop", async (ctx) => {
    try {
        await ctx.answerCallbackQuery();
        ctx.editMessageText(ctx.t("selectRate"), {
            parse_mode: "HTML",
            reply_markup: inlineKeybords.startRate(ctx),
        });
    } catch (error) {
        console.error(error);
    }
});

composer.callbackQuery("settingsPercent", async (ctx) => {
    try {
        await ctx.answerCallbackQuery();
        ctx.editMessageText(ctx.t("selectPercent"), {
            parse_mode: "HTML",
            reply_markup: inlineKeybords.startPercent(ctx),
        });
    } catch (error) {
        console.error(error);
    }
});