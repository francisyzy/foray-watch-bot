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
    return ctx.reply(
      "Welcome to foray watch bot. Forward your @chtwrsbot foray & trader records here!",
    );
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
<b>⚔️ Foray went.</b>: ${user.forrayAtkHit + user.forrayAtkMiss}
<b>⚔️ Foray success.</b>: ${user.forrayAtkHit}
<b>⚔️ Foray failure.</b>: ${user.forrayAtkMiss}
<b>⚔️ Foray success %</b>: ${
        user.forrayAtkHit / (user.forrayAtkHit + user.forrayAtkMiss)
      }
<b>⚔️ Foray exp.</b>: ${user.atkXp}
<b>⚔️ Foray gold💰</b>: ${user.atkGold}
<b>⚔️ Foray gold lost.</b>: ${user.atkGoldLost}

<b>🛡 Foray.</b>: ${user.forrayDefHit + user.forrayDefMiss}
<b>🛡 Foray blocked💦</b>: ${user.forrayDefHit}
<b>🛡 Foray missed🔥</b>: ${user.forrayDefMiss}
<b>🛡 Foray gold💰</b>: ${user.defGold}
<b>🛡 Foray xp.</b>: ${user.defXp}

<b>Trader came.</b>: ${user.traderHit}
<b>Trader xp.</b>: ${user.traderXp}
<b>Trader gold💰</b>: ${user.traderGold}
<b>Trader rate.</b>: ${user.traderHit / user.forrayDefHit}`,
    );
  });

  bot.help((ctx) =>
    ctx.replyWithHTML(
      `Hi! To use this bot, simply forward your 🧹Intervene or <a href="https://chatwars-wiki.de/index.php?title=Foray">foray</a> result or Trader Gold Message and the bot will track it!\n\n/intervals - to see your 🛡 intervals\n/stats - to see your overall stats`,
    ),
  );
};

export default helper;
