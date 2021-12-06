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
      "Welcome to forrai spai bot. Forward your forray & trader records here!",
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
<b>Total foray went.</b>: ${user.forrayAtkHit + user.forrayAtkMiss}
<b>Total foray success.</b>: ${user.forrayAtkHit}
<b>Total foray failure.</b>: ${user.forrayAtkMiss}
<b>Total foray exp.</b>: ${user.atkXp}
<b>Total foray gold.</b>: ${user.atkGold}
<b>Total foray gold lost.</b>: ${user.atkGoldLost}

<b>Total def foray.</b>: ${user.forrayDefHit + user.forrayDefMiss}
<b>Total def foray blocked.</b>: ${user.forrayDefHit}
<b>Total def foray missed.</b>: ${user.forrayDefMiss}
<b>Total def foray gold.</b>: ${user.defGold}
<b>Total def foray xp.</b>: ${user.defXp}

<b>Total trader.</b>: ${user.traderHit}
<b>Total trader xp.</b>: ${user.traderXp}
<b>Total trader gold.</b>: ${user.traderGold}
<b>Total trader rate.</b>: ${user.traderHit / user.forrayDefHit}`,
    );
  });

  bot.help((ctx) => ctx.reply("Help message"));
};

export default helper;
