import { Composer } from "grammy";
import { ContextType } from "../../types/index.js";

export const composer = new Composer<ContextType>();

composer.command("help", async (ctx) => {
    try {
        ctx.deleteMessage()
        await ctx.reply(ctx.t("help"), {parse_mode: "HTML"});
    } catch (error) {
        console.error(error);
    }
});
