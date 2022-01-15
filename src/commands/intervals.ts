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
    return ctx.replyWithHTML(await intervalFunction(ctx.from.id, 2));
  });
  bot.hears(/\/intervals_(.+)/, async (ctx) => {
    const intervalsNumber = Number(ctx.match[1]);
    return ctx.replyWithHTML(
      await intervalFunction(ctx.from.id, intervalsNumber),
    );
  });
};

async function intervalFunction(
  telegramId: number,
  number: number,
): Promise<string> {
  if (isNaN(number)) {
    return "Not a number!";
  }
  const defList = await prisma.forayDef.findMany({
    where: { userTelegramId: telegramId },
    orderBy: {
      time: "desc",
    },
    take: number + 1,
    include: { user: { select: { timeZone: true } } },
  });

  if (defList.length === 0) {
    return "No intervals available. Forward some 🛡 Foray first";
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

  //If < 0 means timezone is negative, else positive timezone
  const userTZ = formatTimezone(defList[0].user.timeZone);

  let averageIntervals: number[] = [];

  for (let i = 0; i < defList.length; i++) {
    const def = defList[i];
    if (i !== 0) {
      const intervalMinutes = extractNumbers(
        formatDistanceStrict(dateCompare, def.time, {
          unit: "minute",
        }),
      )[0];
      averageIntervals.push(intervalMinutes);
      returnString += dateFormat(intervalMinutes) + "\n\n";
    }

    if (i !== defList.length - 1) {
      returnString += formatISO9075(utcToZonedTime(def.time, userTZ));
      if (def.miss) {
        returnString += "🔥\n";
      } else {
        returnString += "🛡\n";
      }

      dateCompare = def.time;
    }
  }
  let total = averageIntervals.reduce((a, b) => a + b);
  const average = total / averageIntervals.length;
  returnString += `<b>Average interval is ${dateFormat(
    average,
  )}</b>\n\n`;

  if (number >= 3) {
    const sorted = averageIntervals.sort(function (a, b) {
      return a - b;
    });
    let median: number;
    if (sorted.length % 2 === 0) {
      median = sorted[Math.trunc(sorted.length / 2)];
    } else {
      median =
        (sorted[sorted.length / 2 + 0.5] +
          sorted[sorted.length / 2 - 0.5]) /
        2;
    }
    returnString += `<b>Median interval is ${dateFormat(
      median,
    )}</b>\n\n`;
  }

  returnString += `<i>Your selected timezone is ${userTZ} /settimezone to change it</i>\n\n`;
  returnString += `<i>/intervals_5 or any number to get the amount of interval you need</i>`;

  if (returnString.length > 4096) {
    return "Message too long, select a shorter interval length";
  }

  return returnString;
}

function dateFormat(minutes: number): string {
  return `${Math.trunc(minutes / 60)} hours ${Math.trunc(
    minutes % 60,
  )} minutes`;
}

export default interval;
