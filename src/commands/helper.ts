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
    return ctx.reply("pongg");
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

    return ctx.replyWithHTML(
      `<b>Name</b>: ${toEscapeHTMLMsg(user.name)}
<b>🗡️ Foray went.</b>: ${user.forayAtkHit + user.forayAtkMiss}
<b>🗡️ Foray success.</b>: ${user.forayAtkHit}
<b>🗡️ Foray failure.</b>: ${user.forayAtkMiss}
<b>🗡️ Foray success %</b>: ${
        (
          (user.forayAtkHit /
            (user.forayAtkHit + user.forayAtkMiss)) *
          100
        ).toFixed(2) + "%"
      }
<b>🗡️ Foray exp.</b>: ${user.atkXp}
<b>🗡️ Foray gold💰</b>: ${user.atkGold}
<b>🗡️ Foray gold lost.</b>: ${user.atkGoldLost}

<b>🛡 Foray.</b>: ${user.forayDefHit + user.forayDefMiss}
<b>🛡 Foray blocked🧹</b>: ${user.forayDefHit}
<b>🛡 Foray missed🔥</b>: ${user.forayDefMiss}
<b>🛡 Foray success %</b>: ${
        (
          (user.forayDefHit /
            (user.forayDefHit + user.forayDefMiss)) *
          100
        ).toFixed(2) + "%"
      }
<b>🛡 Foray gold💰</b>: ${user.defGold}
<b>🛡 Foray xp.</b>: ${user.defXp}

<b>Trader came.</b>: ${user.traderHit}
<b>Trader xp.</b>: ${user.traderXp}
<b>Trader gold💰</b>: ${user.traderGold}
<b>Trader rate.</b>: ${
        ((user.traderHit / user.forayDefHit) * 100).toFixed(2) + "%"
      }`,
    );
  });

  bot.help((ctx) =>
    ctx.replyWithHTML(
      `Hi! To use this bot, simply forward your 🧹Intervene or <a href="https://chatwars-wiki.de/index.php?title=Foray">foray</a> result or <a href="https://chatwars-wiki.de/index.php?title=Game_updates/2019-03-19">Trader</a> Gold Message and the bot will track it!\n\n/intervals - to see your 🛡 intervals\n/stats - to see your overall stats\n<i>For bug reports, please create an issue at <a href="http://go.francisyzy.com/foray-watch-bot-issues">Github</a></i>`,
    ),
  );
};

export default helper;
