import { Message } from "typegram";
import { Telegraf } from "telegraf";

import config from "./config";

import bot from "./lib/bot";
import helper from "./commands/helper";

import { toEscapeHTMLMsg } from "./utils/messageHandler";
import catchAll from "./commands/catch-all";
import record from "./commands/record";
import interval from "./commands/intervals";
import admin from "./commands/admin";
import timezone from "./commands/timezone";
import { printBotInfo } from "./utils/consolePrintUsername";

const index = () => {
  //Production Settings
  if (process.env.NODE_ENV === "production") {
    //Production Logging
    bot.use((ctx, next) => {
      if (ctx.message && config.LOG_GROUP_ID) {
        let userInfo: string;
        if (ctx.message.from.username) {
          userInfo = `name: <a href="tg://user?id=${
            ctx.message.from.id
          }">${toEscapeHTMLMsg(ctx.message.from.first_name)}</a> (@${
            ctx.message.from.username
          })`;
        } else {
          userInfo = `name: <a href="tg://user?id=${
            ctx.message.from.id
          }">${toEscapeHTMLMsg(ctx.message.from.first_name)}</a>`;
        }
        const text = `\ntext: ${
          (ctx.message as Message.TextMessage).text
        }`;
        const logMessage = userInfo + toEscapeHTMLMsg(text);
        bot.telegram.sendMessage(config.LOG_GROUP_ID, logMessage, {
          parse_mode: "HTML",
        });
      }
      return next();
    });
  } else {
    //Development logging
    bot.use(Telegraf.log());
    bot.launch();
    printBotInfo(bot);
  }

  helper();
  record();
  interval();
  admin();
  timezone();

  //Catch all unknown messages/commands
  catchAll();
};

if (process.env.NODE_ENV !== "production") {
  index();
}
export default index;
