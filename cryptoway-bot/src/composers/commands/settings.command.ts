import { Composer } from "grammy";
import { ContextType } from "../../types/index.js";
import { inlineKeybords } from "../../keyboards/inline/index.js";

export const composer = new Composer<ContextType>();

composer.command("settings", async (ctx) => {
    try {
        ctx.deleteMessage();
        await ctx.reply(ctx.t("settingsOpen"), {
            reply_markup: inlineKeybords.settingsOpen(ctx),
        });
    } catch (error) {
        console.error(error);
    }
});
