import "dotenv/config";
import "./database/db.js";

import { Bot, session } from "grammy";
import { freeStorage } from "@grammyjs/storage-free";
import { ContextType, SessionData } from "./types/index.js";
import { setMyCommands } from "./untils/setMyCommands.js";
import { composer as startCommand } from "./composers/commands/start.command.js";
import { composer as helpCommand } from "./composers/commands/help.command.js";
import { composer as settingsCommand } from "./composers/commands/settings.command.js";
import { composer as coinsCommand } from "./composers/commands/coins.command.js";
import { composer as startCallback } from "./composers/callbacks/start.callback.js";
import { composer as settingsCallback } from "./composers/callbacks/settings.callback.js";
import { composer as noneMessage } from "./composers/messages/none.messages.js";
import { i18nMiddleware, limitMiddleware } from "./plugins/index.js";
import { setCheckCoins } from "./untils/setCheckCoins.js";

if (!process.env.TOKEN) throw new Error("invalided token");

const bot = new Bot<ContextType>(process.env.TOKEN);

// Settings
setMyCommands(bot);

// Plugins
bot.use(i18nMiddleware);
bot.use(limitMiddleware)

bot.use(session({
    initial: () => ({ type: "base", percent: 5 }),
    storage: freeStorage<SessionData>(bot.token),
  }));

// Handlers
bot.use(startCommand);
bot.use(settingsCommand)
bot.use(coinsCommand)
bot.use(helpCommand);
bot.use(startCallback)
bot.use(settingsCallback)
bot.use(noneMessage)

setCheckCoins(bot)
// Start
bot.catch((error) => console.error(error))
bot.start();

