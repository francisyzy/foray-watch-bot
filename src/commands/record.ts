import bot from "../lib/bot";
import { PrismaClient, Prisma } from "@prisma/client";
import { Message } from "typegram";
import { extractNumbers } from "../utils/extractNumbers";
import { sameForay } from "../utils/dateCompare";
import { formatDistanceStrict } from "date-fns";
import { dateFormat } from "../utils/messageHandler";

const prisma = new PrismaClient();
//record forwarded messages commands
const record = () => {
  bot.on("forward_date", async (ctx) => {
    if (ctx.message.forward_from!.username! == "chtwrsbot") {
      const forwardText = (ctx.message as Message.TextMessage).text;
      const forayDate = new Date(ctx.message.forward_date! * 1000);

      //User sometimes just straight up did not create account first, so fail to find last information
      const user = await prisma.user.upsert({
        where: { telegramId: ctx.from.id },
        update: {},
        create: {
          telegramId: ctx.from.id,
          name: ctx.from.first_name,
        },
      });

      if (
        forwardText.includes("oн безнаказанно ограбил") ||
        forwardText.includes("You successfully defeated") ||
        forwardText.includes("Your body hurts, but for some") ||
        forwardText.includes("We hope you feel terrible.")
      ) {
        const lastForay = await prisma.forayDef.findFirst({
          where: {
            userTelegramId: user.telegramId,
          },
          orderBy: {
            time: "desc",
          },
        });

        if (lastForay) {
          if (!sameForay(lastForay.time, forayDate)) {
            ctx.reply(
              `Difference from last 🛡 foray ${dateFormat(
                extractNumbers(
                  formatDistanceStrict(lastForay.time, forayDate, {
                    unit: "minute",
                  }),
                )[0],
              )}`,
            );
          }
        }

        if (forwardText.includes("You successfully defeated")) {
          const numbers = extractNumbers(forwardText.split("\n")[1]);
          await prisma.forayDef
            .create({
              data: {
                time: forayDate,
                miss: false,
                gold: numbers[0],
                xp: numbers[1],
                userTelegramId: user.telegramId,
              },
            })
            .then(async () => {
              await prisma.user.update({
                where: {
                  telegramId: user.telegramId,
                },
                data: {
                  forayDefHit: { increment: 1 },
                  defGold: { increment: numbers[0] },
                  defXp: { increment: numbers[1] },
                },
              });
              ctx.reply("🧹🛡 Foray Recorded");
            })
            .catch((error) => {
              if (
                error instanceof Prisma.PrismaClientKnownRequestError
              ) {
                if (error.code === "P2002") {
                  ctx.reply("You have already recorded this 🛡 foray");
                }
              }
            });
        } else if (forwardText.includes("Your body hurts, but for")) {
          const numbers = extractNumbers(forwardText.split("\n")[1]);
          await prisma.forayDef
            .create({
              data: {
                time: forayDate,
                miss: false,
                gold: 0,
                xp: numbers[0],
                userTelegramId: user.telegramId,
              },
            })
            .then(async () => {
              await prisma.user.update({
                where: {
                  telegramId: user.telegramId,
                },
                data: {
                  forayDefHit: { increment: 1 },
                  defXp: { increment: numbers[0] },
                },
              });
              ctx.reply("🧹🛡 Foray Recorded");
            })
            .catch((error) => {
              if (
                error instanceof Prisma.PrismaClientKnownRequestError
              ) {
                if (error.code === "P2002") {
                  ctx.reply("You have already recorded this 🛡 foray");
                }
              }
            });
        } else {
          await prisma.forayDef
            .create({
              data: {
                time: forayDate,
                miss: true,
                gold: 0,
                xp: 0,
                userTelegramId: user.telegramId,
              },
            })
            .then(async () => {
              await prisma.user.update({
                where: {
                  telegramId: user.telegramId,
                },
                data: {
                  forayDefMiss: { increment: 1 },
                },
              });
              ctx.reply("🔥🛡 Foray Recorded");
            })
            .catch((error) => {
              if (
                error instanceof Prisma.PrismaClientKnownRequestError
              ) {
                if (error.code === "P2002") {
                  ctx.reply("You have already recorded this 🛡 foray");
                }
              }
            });
        }
      } else if (
        forwardText.includes("Village was successfully pillaged")
      ) {
        const numbers = extractNumbers(forwardText.split("\n")[1]);

        await prisma.forayAtk
          .create({
            data: {
              time: forayDate,
              miss: false,
              gold: numbers[0],
              xp: numbers[1],
              userTelegramId: user.telegramId,
            },
          })
          .then(async () => {
            await prisma.user.update({
              where: {
                telegramId: user.telegramId,
              },
              data: {
                forayAtkHit: { increment: 1 },
                atkGold: { increment: numbers[0] },
                atkXp: { increment: numbers[1] },
              },
            });
            ctx.reply("🗡️ Foray Recorded");
          })
          .catch((error) => {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError
            ) {
              if (error.code === "P2002") {
                ctx.reply("You have already recorded this 🗡️ foray");
              }
            }
          });
      } else if (
        forwardText.includes(
          "You crawled back home to a nice warm bath",
        )
      ) {
        const numbers = extractNumbers(forwardText.split("\n")[1]);
        await prisma.forayAtk
          .create({
            data: {
              time: forayDate,
              miss: true,
              gold: numbers[0],
              xp: 0,
              userTelegramId: user.telegramId,
            },
          })
          .then(async () => {
            await prisma.user.update({
              where: {
                telegramId: user.telegramId,
              },
              data: {
                forayAtkMiss: { increment: 1 },
                atkGoldLost: { increment: numbers[0] },
              },
            });
            ctx.reply("🗡️ Foray Recorded");
          })
          .catch((error) => {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError
            ) {
              if (error.code === "P2002") {
                ctx.reply("You have already recorded this 🗡️ foray");
              }
            }
          });
      } else if (
        forwardText.includes(
          "You have satisfied your lust for violence and left back home",
        )
      ) {
        const numbers = extractNumbers(forwardText.split("\n")[1]);
        await prisma.forayAtk
          .create({
            data: {
              time: forayDate,
              miss: true,
              gold: 0,
              xp: numbers[0],
              userTelegramId: user.telegramId,
            },
          })
          .then(async () => {
            await prisma.user.update({
              where: {
                telegramId: user.telegramId,
              },
              data: {
                forayAtkMiss: { increment: 1 },
                atkXp: { increment: numbers[0] },
              },
            });
            ctx.reply("🗡️ Foray Recorded");
          })
          .catch((error) => {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError
            ) {
              if (error.code === "P2002") {
                ctx.reply("You have already recorded this 🗡️ foray");
              }
            }
          });
      } else if (
        forwardText.includes(
          "The trader gave you some gold and left.",
        )
      ) {
        const numbers = extractNumbers(forwardText.split("\n")[2]);
        await prisma.trader
          .create({
            data: {
              time: forayDate,
              gold: numbers[1],
              xp: numbers[0],
              userTelegramId: user.telegramId,
            },
          })
          .then(async () => {
            await prisma.user.update({
              where: {
                telegramId: user.telegramId,
              },
              data: {
                traderHit: { increment: 1 },
                traderGold: { increment: numbers[1] },
                traderXp: { increment: numbers[0] },
              },
            });
            ctx.reply("Trader Recorded");
          })
          .catch((error) => {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError
            ) {
              if (error.code === "P2002") {
                ctx.reply("You have already recorded this trader");
              }
            }
          });
      } else {
        return ctx.replyWithHTML(
          `Unrecognised foray message\n\n<i>For bug reports, please create an issue at <a href="http://go.francisyzy.com/foray-watch-bot-issues">Github</a></i>`,
        );
      }
    }
  });
};

export default record;
