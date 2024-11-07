import { I18n } from "@grammyjs/i18n";
import { ContextType } from "../types/index.js";
import path from "path";

export const i18n = new I18n<ContextType>({
    defaultLocale: "en",
    directory: path.resolve(process.cwd(), 'src/locales'),
});

export const i18nMiddleware = i18n.middleware()