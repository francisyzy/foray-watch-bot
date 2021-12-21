import bot from "../lib/bot";
import { PrismaClient } from "@prisma/client";
import { subDays } from "date-fns";
import config from "../config";

const prisma = new PrismaClient();

//admin commands
const admin = () => {
  bot.command("/users", async (ctx) => {
    if (!checkAdmin(ctx.chat.id)) {
      return;
    }
    const newUsers = await prisma.user.count({
      where: { createdAt: { gte: subDays(new Date(), 7) } },
    });
    const activeUsers = await prisma.user.count({
      where: { updatedAt: { gte: subDays(new Date(), 7) } },
    });
    const ghostUsers = await prisma.user.count({
      where: {
        forayAtkHit: 0,
        forayAtkMiss: 0,
        forayDefHit: 0,
        forayDefMiss: 0,
        traderHit: 0,
      },
    });
    const totalUsers = await prisma.user.count({});
    return ctx.replyWithHTML(`
<b>totalUsers:</b>${totalUsers}
<b>newUsers:</b>${newUsers}
<b>activeUsers:</b>${activeUsers}
<b>ghostUsers:</b>${ghostUsers}
`);
  });
};

function checkAdmin(telegramId: number): boolean {
  return telegramId === config.ADMIN_TELEGRAM_ID;
}

export default admin;
