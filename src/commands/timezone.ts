import bot from "../lib/bot";
import { PrismaClient } from "@prisma/client";
import { InlineKeyboardButton } from "typegram";
import { Markup } from "telegraf";
import { formatTimezone } from "../utils/messageHandler";

const prisma = new PrismaClient();
//timezone commands
const timezone = () => {
  bot.command("settimezone", (ctx) => {
    let timeZoneList: (InlineKeyboardButton & {
      hide?: boolean | undefined;
    })[] = [];
    //https://en.wikipedia.org/wiki/List_of_UTC_time_offsets
    //ignoring all the 30min and 45 coz code not meant for it?
    timeZoneList.push(Markup.button.callback("-12:00", "tz-12"));
    timeZoneList.push(Markup.button.callback("-11:00", "tz-11"));
    timeZoneList.push(Markup.button.callback("-10:00", "tz-10"));
    timeZoneList.push(Markup.button.callback("-09:00", "tz-9"));
    timeZoneList.push(Markup.button.callback("-08:00", "tz-8"));
    timeZoneList.push(Markup.button.callback("-07:00", "tz-7"));
    timeZoneList.push(Markup.button.callback("-06:00", "tz-6"));
    timeZoneList.push(Markup.button.callback("-05:00", "tz-5"));
    timeZoneList.push(Markup.button.callback("-04:00", "tz-4"));
    timeZoneList.push(Markup.button.callback("-03:00", "tz-3"));
    timeZoneList.push(Markup.button.callback("-02:00", "tz-2"));
    timeZoneList.push(Markup.button.callback("-01:00", "tz-1"));
    timeZoneList.push(Markup.button.callback("±00:00", "tz0"));
    timeZoneList.push(Markup.button.callback("+01:00", "tz1"));
    timeZoneList.push(Markup.button.callback("+02:00", "tz2"));
    timeZoneList.push(Markup.button.callback("+03:00", "tz3"));
    timeZoneList.push(Markup.button.callback("+04:00", "tz4"));
    timeZoneList.push(Markup.button.callback("+05:00", "tz5"));
    timeZoneList.push(Markup.button.callback("+06:00", "tz6"));
    timeZoneList.push(Markup.button.callback("+07:00", "tz7"));
    timeZoneList.push(Markup.button.callback("+08:00", "tz8"));
    timeZoneList.push(Markup.button.callback("+09:00", "tz9"));
    timeZoneList.push(Markup.button.callback("+10:00", "tz10"));
    timeZoneList.push(Markup.button.callback("+11:00", "tz11"));
    timeZoneList.push(Markup.button.callback("+12:00", "tz12"));
    timeZoneList.push(Markup.button.callback("+13:00", "tz13"));
    timeZoneList.push(Markup.button.callback("+14:00", "tz14"));
    timeZoneList.push(Markup.button.callback("+14:00", "tz14"));
    timeZoneList.push(Markup.button.callback("🚫", "tze"));

    return ctx.reply(
      "Select your timezone or 🚫 to cancel",
      Markup.inlineKeyboard(timeZoneList, {
        //set up custom keyboard wraps for two columns
        wrap: (btn, index, currentRow) => {
          if (currentRow.length === 2) {
            return true;
          } else {
            return false;
          }
        },
      }),
    );
  });
  bot.action(/.+/, async (ctx) => {
    const action = ctx.match[0].split("");
    const selectedTZ = Number(ctx.match[0].substring(2));
    if (action[2] === "e") {
      return ctx.editMessageText("Exiting timezone management");
    } else if (!(action[0] === "t" && action[1] === "z")) {
      return ctx.editMessageText("Invalid option");
    }
    await prisma.user.update({
      where: { telegramId: ctx!.from!.id! },
      data: { timeZone: selectedTZ },
    });
    return ctx.editMessageText(
      `Your timezone has been updated to ${formatTimezone(
        selectedTZ,
      )}`,
    );
  });
};

export default timezone;
