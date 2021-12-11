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

  bot.command("reset", async (ctx) => {
    await prisma.forayDef.deleteMany();
    await prisma.forayAtk.deleteMany();
    await prisma.trader.deleteMany();
    await prisma.user.deleteMany();
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
<b>⚔️ Foray went.</b>: ${user.forayAtkHit + user.forayAtkMiss}
<b>⚔️ Foray success.</b>: ${user.forayAtkHit}
<b>⚔️ Foray failure.</b>: ${user.forayAtkMiss}
<b>⚔️ Foray success %</b>: ${
        user.forayAtkHit / (user.forayAtkHit + user.forayAtkMiss)
      }
<b>⚔️ Foray exp.</b>: ${user.atkXp}
<b>⚔️ Foray gold💰</b>: ${user.atkGold}
<b>⚔️ Foray gold lost.</b>: ${user.atkGoldLost}

<b>🛡 Foray.</b>: ${user.forayDefHit + user.forayDefMiss}
<b>🛡 Foray blocked💦</b>: ${user.forayDefHit}
<b>🛡 Foray missed🔥</b>: ${user.forayDefMiss}
<b>🛡 Foray gold💰</b>: ${user.defGold}
<b>🛡 Foray xp.</b>: ${user.defXp}

<b>Trader came.</b>: ${user.traderHit}
<b>Trader xp.</b>: ${user.traderXp}
<b>Trader gold💰</b>: ${user.traderGold}
<b>Trader rate.</b>: ${user.traderHit / user.forayDefHit}`,
    );
  });

  bot.help((ctx) =>
    ctx.replyWithHTML(
      `Hi! To use this bot, simply forward your 🧹Intervene or <a href="https://chatwars-wiki.de/index.php?title=Foray">foray</a> result or Trader Gold Message and the bot will track it!\n\n/intervals - to see your 🛡 intervals\n/stats - to see your overall stats`,
    ),
  );
};

export default helper;
