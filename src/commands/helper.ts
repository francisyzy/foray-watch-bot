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

  bot.command("account", async (ctx) => {
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
      `<b>Name</b>: ${toEscapeHTMLMsg(
        user.name,
      )} \n<b>Timezone.</b>: ${user.timeZone}`,
    );
  });

  bot.help((ctx) => ctx.reply("Help message"));
};

export default helper;
