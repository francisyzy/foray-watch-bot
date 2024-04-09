import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function importData() {
  const fileContents = fs.readFileSync("data-dump.json", "utf8");
  const users = JSON.parse(fileContents);

  for (const user of users) {
    // Prepare the data for the user and related records
    const userData = {
      telegramId: user.telegramId,
      name: user.name,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
      timeZone: user.timeZone,
      forayAtkHit: user.forayAtkHit,
      forayAtkMiss: user.forayAtkMiss,
      atkXp: user.atkXp,
      atkGold: user.atkGold,
      atkGoldLost: user.atkGoldLost,
      forayDefHit: user.forayDefHit,
      forayDefMiss: user.forayDefMiss,
      defXp: user.defXp,
      defGold: user.defGold,
      traderHit: user.traderHit,
      traderXp: user.traderXp,
      traderGold: user.traderGold,
      forayDef: {
        create: user.forayDef.map(
          (def: {
            time: string | number | Date;
            miss: any;
            gold: any;
            xp: any;
          }) => ({
            time: new Date(def.time),
            miss: def.miss,
            gold: def.gold,
            xp: def.xp,
          }),
        ),
      },
      forayAtk: {
        create: user.forayAtk.map(
          (atk: {
            time: string | number | Date;
            miss: any;
            gold: any;
            xp: any;
          }) => ({
            time: new Date(atk.time),
            miss: atk.miss,
            gold: atk.gold,
            xp: atk.xp,
          }),
        ),
      },
      trader: {
        create: user.trader.map(
          (trade: {
            time: string | number | Date;
            gold: any;
            xp: any;
          }) => ({
            time: new Date(trade.time),
            gold: trade.gold,
            xp: trade.xp,
          }),
        ),
      },
    };

    // Execute the transaction for the user and related records
    await prisma.$transaction([
      prisma.user.create({ data: userData }),
    ]);
    console.log("inserted " + user.name);
  }

  console.log("Data import completed successfully.");
}

importData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
