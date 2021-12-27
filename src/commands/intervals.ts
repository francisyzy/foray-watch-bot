import bot from "../lib/bot";
import { PrismaClient } from "@prisma/client";
import {
  formatDistanceStrict,
  formatDistanceToNowStrict,
  formatISO9075,
} from "date-fns";
import { extractNumbers } from "../utils/extractNumbers";
import { utcToZonedTime } from "date-fns-tz";
import { formatTimezone } from "../utils/messageHandler";

const prisma = new PrismaClient();
//interval commands
const interval = () => {
  bot.command("intervals", async (ctx) => {
    const defList = await prisma.forayDef.findMany({
      where: { userTelegramId: ctx.from.id },
      orderBy: {
        time: "desc",
      },
      take: 3,
      include: { user: { select: { timeZone: true } } },
    });

    if (defList.length === 0) {
      return ctx.reply(
        "No intervals available. Forward some 🛡 Foray first",
      );
    }

    let returnString = "";
    if (defList[0]) {
      returnString += "Time passed since last foray:\n";
      returnString +=
        formatDistanceToNowStrict(defList[0].time, {
          unit: "hour",
        }) + " ";
      returnString +=
        (extractNumbers(
          formatDistanceToNowStrict(defList[0].time, {
            unit: "minute",
          }),
        )[0] %
          60) +
        " minutes\n\n";
    }

    returnString += "Recent Intervals:\n";

    let dateCompare = new Date();

    //If < 0 means timezone is negative, else postive timezone
    const userTZ = formatTimezone(defList[0].user.timeZone);

    for (let i = 0; i < defList.length; i++) {
      const def = defList[i];
      if (i !== 0) {
        returnString +=
          formatDistanceStrict(dateCompare, def.time, {
            unit: "hour",
          }) + " ";
        returnString +=
          extractNumbers(
            formatDistanceStrict(dateCompare, def.time, {
              unit: "minute",
            }),
          )[0] % 60;
        returnString += " minutes\n\n";
      }

      if (i !== defList.length - 1) {
        returnString += formatISO9075(
          utcToZonedTime(def.time, userTZ),
        );
        if (def.miss) {
          returnString += "🔥\n";
        } else {
          returnString += "🛡\n";
        }

        dateCompare = def.time;
      }
    }

    returnString += `<i>Your selected timezone is ${userTZ} /settimezone to change it</i>`;

    return ctx.replyWithHTML(returnString);
  });
};

export default interval;
