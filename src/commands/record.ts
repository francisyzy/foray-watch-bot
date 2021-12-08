import bot from "../lib/bot";
import { PrismaClient, Prisma } from "@prisma/client";
import { Message } from "typegram";
import { extractNumbers } from "../utils/extractNumbers";
import { sameForray } from "../utils/dateCompare";
import { formatDistanceStrict } from "date-fns";

const prisma = new PrismaClient();
//record forwarded messages commands
const record = () => {
  bot.on("forward_date", async (ctx) => {
    if (ctx.message.forward_from!.username! == "chtwrsbot") {
      const forwardText = (ctx.message as Message.TextMessage).text;
      const forrayDate = new Date(ctx.message.forward_date! * 1000);

      if (
        forwardText.includes("You successfully defeated") ||
        forwardText.includes("Your body hurts, but for some") ||
        forwardText.includes("We hope you feel terrible.")
      ) {
        const lastForray = await prisma.forrayDef.findFirst({
          where: {
            userTelegramId: ctx.from.id,
          },
          orderBy: {
            time: "desc",
          },
        });

        if (lastForray) {
          if (!sameForray(lastForray.time, forrayDate)) {
            const differenceHrs = formatDistanceStrict(
              lastForray.time,
              forrayDate,
              { unit: "hour" },
            );
            const differenceMins =
              extractNumbers(
                formatDistanceStrict(lastForray.time, forrayDate, {
                  unit: "minute",
                }),
              )[0] % 60;
            ctx.reply(
              `Difference from last 🛡 foray ${differenceHrs} ${differenceMins} minutes`,
            );
          }
        }

        if (forwardText.includes("You successfully defeated")) {
          const numbers = extractNumbers(forwardText.split("\n")[1]);
          await prisma.forrayDef
            .create({
              data: {
                time: forrayDate,
                miss: false,
                gold: numbers[0],
                xp: numbers[1],
                userTelegramId: ctx.from.id,
              },
            })
            .then(async () => {
              await prisma.user.update({
                where: {
                  telegramId: ctx.from.id,
                },
                data: {
                  forrayDefHit: { increment: 1 },
                  defGold: { increment: numbers[0] },
                  defXp: { increment: numbers[1] },
                },
              });
              ctx.reply("🛡 Foray Recorded");
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
          await prisma.forrayDef
            .create({
              data: {
                time: forrayDate,
                miss: false,
                gold: 0,
                xp: numbers[0],
                userTelegramId: ctx.from.id,
              },
            })
            .then(async () => {
              await prisma.user.update({
                where: {
                  telegramId: ctx.from.id,
                },
                data: {
                  forrayDefHit: { increment: 1 },
                  defXp: { increment: numbers[0] },
                },
              });
              ctx.reply("🛡 Foray Recorded");
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
          await prisma.forrayDef
            .create({
              data: {
                time: forrayDate,
                miss: true,
                gold: 0,
                xp: 0,
                userTelegramId: ctx.from.id,
              },
            })
            .then(async () => {
              await prisma.user.update({
                where: {
                  telegramId: ctx.from.id,
                },
                data: {
                  forrayDefMiss: { increment: 1 },
                },
              });
              ctx.reply("🛡 Foray Recorded");
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

        await prisma.forrayAtk
          .create({
            data: {
              time: forrayDate,
              miss: false,
              gold: numbers[0],
              xp: numbers[1],
              userTelegramId: ctx.from.id,
            },
          })
          .then(async () => {
            await prisma.user.update({
              where: {
                telegramId: ctx.from.id,
              },
              data: {
                forrayAtkHit: { increment: 1 },
                atkGold: { increment: numbers[0] },
                atkXp: { increment: numbers[1] },
              },
            });
            ctx.reply("⚔️ Foray Recorded");
          })
          .catch((error) => {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError
            ) {
              if (error.code === "P2002") {
                ctx.reply("You have already recorded this ⚔️ foray");
              }
            }
          });
      } else if (
        forwardText.includes(
          "You crawled back home to a nice warm bath",
        )
      ) {
        const numbers = extractNumbers(forwardText.split("\n")[1]);
        await prisma.forrayAtk
          .create({
            data: {
              time: forrayDate,
              miss: true,
              gold: numbers[0],
              xp: 0,
              userTelegramId: ctx.from.id,
            },
          })
          .then(async () => {
            await prisma.user.update({
              where: {
                telegramId: ctx.from.id,
              },
              data: {
                forrayAtkMiss: { increment: 1 },
                atkGoldLost: { increment: numbers[0] },
              },
            });
            ctx.reply("⚔️ Foray Recorded");
          })
          .catch((error) => {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError
            ) {
              if (error.code === "P2002") {
                ctx.reply("You have already recorded this ⚔️ foray");
              }
            }
          });
      } else if (
        forwardText.includes(
          "You have satisfied your lust for violence and left back home",
        )
      ) {
        const numbers = extractNumbers(forwardText.split("\n")[1]);
        await prisma.forrayAtk
          .create({
            data: {
              time: forrayDate,
              miss: true,
              gold: 0,
              xp: numbers[0],
              userTelegramId: ctx.from.id,
            },
          })
          .then(async () => {
            await prisma.user.update({
              where: {
                telegramId: ctx.from.id,
              },
              data: {
                forrayAtkMiss: { increment: 1 },
                atkXp: { increment: numbers[0] },
              },
            });
            ctx.reply("⚔️ Foray Recorded");
          })
          .catch((error) => {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError
            ) {
              if (error.code === "P2002") {
                ctx.reply("You have already recorded this ⚔️ foray");
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
              time: forrayDate,
              gold: numbers[1],
              xp: numbers[0],
              userTelegramId: ctx.from.id,
            },
          })
          .then(async () => {
            await prisma.user.update({
              where: {
                telegramId: ctx.from.id,
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
      }
    }
  });
};

export default record;
