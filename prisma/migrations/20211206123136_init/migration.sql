-- CreateTable
CREATE TABLE "User" (
    "telegramId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeZone" INTEGER NOT NULL DEFAULT 8,
    "forrayHit" INTEGER NOT NULL DEFAULT 0,
    "forrayMiss" INTEGER NOT NULL DEFAULT 0,
    "traderHit" INTEGER NOT NULL DEFAULT 0,
    "traderXp" INTEGER NOT NULL DEFAULT 0,
    "traderGold" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "gold" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("telegramId")
);

-- CreateTable
CREATE TABLE "forray" (
    "time" TIMESTAMP(3) NOT NULL,
    "miss" BOOLEAN NOT NULL,
    "gold" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "userTelegramId" INTEGER NOT NULL,

    CONSTRAINT "forray_pkey" PRIMARY KEY ("time")
);

-- CreateTable
CREATE TABLE "trader" (
    "time" TIMESTAMP(3) NOT NULL,
    "traderGold" INTEGER NOT NULL,
    "traderXp" INTEGER NOT NULL,
    "userTelegramId" INTEGER NOT NULL,

    CONSTRAINT "trader_pkey" PRIMARY KEY ("time")
);

-- AddForeignKey
ALTER TABLE "forray" ADD CONSTRAINT "forray_userTelegramId_fkey" FOREIGN KEY ("userTelegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trader" ADD CONSTRAINT "trader_userTelegramId_fkey" FOREIGN KEY ("userTelegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;
