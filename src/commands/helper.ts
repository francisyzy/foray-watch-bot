import bot from "../lib/bot";
import { PrismaClient } from "@prisma/client";
import { toEscapeHTMLMsg } from "../utils/messageHandler";
import { getBotCommands } from "../utils/botCommands";

const prisma = new PrismaClient();
//General helper commands
const helper = () => {
  //All bots start with /start
  bot.start(async (ctx) => {
    ctx.setMyCommands(getBotCommands());
    await prisma.user.upsert({
      where: { telegramId: ctx.from.id },
      update: {
        name: ctx.from.first_name,
      },
      create: {
        telegramId: ctx.from.id,
        name: ctx.from.first_name,
      },
    });
    return ctx.replyWithHTML(
      "Welcome to foray watch bot. Forward your @chtwrsbot foray & trader records here!\n<i>/help</i> for more info",
    );
  });

  bot.command("ping", (ctx) => {
    return ctx.reply("pong");
  });

  bot.command("stats", async (ctx) => {
    const user = await prisma.user.upsert({
      where: { telegramId: ctx.from.id },
      update: {
        name: ctx.from.first_name,
      },
      create: {
        telegramId: ctx.from.id,
        name: ctx.from.first_name,
      },
    });

    let returnString = `<b>Name</b>: ${toEscapeHTMLMsg(
      user.name,
    )}\n\n`;

    //Add Foray atk stats
    if (!(user.forayAtkHit === 0 && user.forayAtkMiss === 0)) {
      returnString += `<b>ð¡ï¸ Foray went</b>: ${
        user.forayAtkHit + user.forayAtkMiss
      }
<b>ð¡ï¸ Foray success</b>: ${user.forayAtkHit}
<b>ð¡ï¸ Foray failure</b>: ${user.forayAtkMiss}
<b>ð¡ï¸ Foray success %</b>: ${
        getNumber(
          (user.forayAtkHit /
            (user.forayAtkHit + user.forayAtkMiss)) *
            100,
        ).toFixed(2) + "%"
      }
<b>ð¡ï¸ Foray xp. (average)</b>: ${user.atkXp} (${getNumber(
        user.atkXp / user.forayAtkHit,
      ).toFixed(2)})
<b>ð¡ï¸ Foray goldð° (average)</b>: ${user.atkGold} (${getNumber(
        user.atkGold / user.forayAtkHit,
      ).toFixed(2)})
<b>ð¡ï¸ Foray gold lost. (average)</b>: ${
        user.atkGoldLost
      } (${getNumber(user.atkGoldLost / user.forayAtkMiss).toFixed(
        2,
      )})\n\n`;
    } else {
      returnString +=
        "<b>ð¡ï¸ Foray</b>: No Stats <i>forward some ð¡ï¸ Results</i>\n\n";
    }

    //Add Foray def stats
    if (!(user.forayDefHit === 0 && user.forayDefMiss === 0)) {
      returnString += `<b>ð¡ Foray</b>: ${
        user.forayDefHit + user.forayDefMiss
      }
<b>ð¡ Foray blockedð§¹</b>: ${user.forayDefHit}
<b>ð¡ Foray missedð¥</b>: ${user.forayDefMiss}
<b>ð¡ Foray success %</b>: ${
        getNumber(
          (user.forayDefHit /
            (user.forayDefHit + user.forayDefMiss)) *
            100,
        ).toFixed(2) + "%"
      }
<b>ð¡ Foray goldð° (average)</b>: ${user.defGold} (${getNumber(
        user.defGold / user.forayDefHit,
      ).toFixed(2)})
<b>ð¡ Foray xp. (average)</b>: ${user.defXp} (${getNumber(
        user.defXp / user.forayDefHit,
      ).toFixed(2)})\n\n`;
    } else {
      returnString +=
        "<b>ð¡ Foray</b>: No Stats <i>forward some ð§¹ Intervene</i>\n\n";
    }

    //Add Trader stats
    if (user.traderHit !== 0) {
      returnString += `<b>Trader came.</b>: ${user.traderHit}
<b>Trader xp. (average)</b>: ${user.traderXp} (${getNumber(
        user.traderXp / user.traderHit,
      ).toFixed(2)})
<b>Trader goldð° (average)</b>: ${user.traderGold} (${getNumber(
        user.traderGold / user.traderHit,
      ).toFixed(2)})
<b>Trader rate.</b>: ${
        getNumber((user.traderHit / user.forayDefHit) * 100).toFixed(
          2,
        ) + "%"
      }\n\n`;
    } else {
      returnString += `<i>If you are a Sentinel, you may have a <a href="https://chatwars-wiki.de/index.php?title=Game_updates/2019-03-19">Trader</a> drop by upon ð§¹ Intervene, forward trader result message to keep track of stats here!</i>\n\n`;
    }

    return ctx.replyWithHTML(returnString);
  });

  bot.help((ctx) =>
    ctx.replyWithHTML(
      `Hi! To use this bot, simply forward your ð§¹Intervene or <a href="https://chatwars-wiki.de/index.php?title=Foray">foray</a> result or <a href="https://chatwars-wiki.de/index.php?title=Game_updates/2019-03-19">Trader</a> Gold Message and the bot will track it!\n\n/intervals - to see your ð¡ intervals\n/intervals_10 to see your latest 10 ð¡ intervals\n/stats - to see your overall stats\n<i>For bug reports, please create an issue at <a href="http://go.francisyzy.com/foray-watch-bot-issues">Github</a></i>`,
    ),
  );
};

export default helper;

function getNumber(num: number): number {
  return isNaN(num) ? 0 : num;
}
