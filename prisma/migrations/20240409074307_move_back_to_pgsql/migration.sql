-- CreateTable
CREATE TABLE "User" (
    "telegramId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeZone" INTEGER NOT NULL DEFAULT 8,
    "forayAtkHit" INTEGER NOT NULL DEFAULT 0,
    "forayAtkMiss" INTEGER NOT NULL DEFAULT 0,
    "atkXp" INTEGER NOT NULL DEFAULT 0,
    "atkGold" INTEGER NOT NULL DEFAULT 0,
    "atkGoldLost" INTEGER NOT NULL DEFAULT 0,
    "forayDefHit" INTEGER NOT NULL DEFAULT 0,
    "forayDefMiss" INTEGER NOT NULL DEFAULT 0,
    "defXp" INTEGER NOT NULL DEFAULT 0,
    "defGold" INTEGER NOT NULL DEFAULT 0,
    "traderHit" INTEGER NOT NULL DEFAULT 0,
    "traderXp" INTEGER NOT NULL DEFAULT 0,
    "traderGold" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("telegramId")
);

-- CreateTable
CREATE TABLE "forayDef" (
    "time" TIMESTAMP(3) NOT NULL,
    "miss" BOOLEAN NOT NULL,
    "gold" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "userTelegramId" INTEGER NOT NULL,

    CONSTRAINT "forayDef_pkey" PRIMARY KEY ("time","userTelegramId")
);

-- CreateTable
CREATE TABLE "forayAtk" (
    "time" TIMESTAMP(3) NOT NULL,
    "miss" BOOLEAN NOT NULL,
    "gold" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "userTelegramId" INTEGER NOT NULL,

    CONSTRAINT "forayAtk_pkey" PRIMARY KEY ("time","userTelegramId")
);

-- CreateTable
CREATE TABLE "trader" (
    "time" TIMESTAMP(3) NOT NULL,
    "gold" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "userTelegramId" INTEGER NOT NULL,

    CONSTRAINT "trader_pkey" PRIMARY KEY ("time","userTelegramId")
);

-- AddForeignKey
ALTER TABLE "forayDef" ADD CONSTRAINT "forayDef_userTelegramId_fkey" FOREIGN KEY ("userTelegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "forayAtk" ADD CONSTRAINT "forayAtk_userTelegramId_fkey" FOREIGN KEY ("userTelegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trader" ADD CONSTRAINT "trader_userTelegramId_fkey" FOREIGN KEY ("userTelegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE NO ACTION;
