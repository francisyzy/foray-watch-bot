/*
  Warnings:

  - You are about to drop the column `forrayHit` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `forrayMiss` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gold` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `xp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `traderGold` on the `trader` table. All the data in the column will be lost.
  - You are about to drop the column `traderXp` on the `trader` table. All the data in the column will be lost.
  - You are about to drop the `forray` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gold` to the `trader` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xp` to the `trader` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "forray" DROP CONSTRAINT "forray_userTelegramId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "forrayHit",
DROP COLUMN "forrayMiss",
DROP COLUMN "gold",
DROP COLUMN "xp",
ADD COLUMN     "atkGold" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "atkXp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "defGold" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "defXp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "forrayAtkHit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "forrayAtkMiss" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "forrayDefHit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "forrayDefMiss" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "trader" DROP COLUMN "traderGold",
DROP COLUMN "traderXp",
ADD COLUMN     "gold" INTEGER NOT NULL,
ADD COLUMN     "xp" INTEGER NOT NULL;

-- DropTable
DROP TABLE "forray";

-- CreateTable
CREATE TABLE "forrayDef" (
    "time" TIMESTAMP(3) NOT NULL,
    "miss" BOOLEAN NOT NULL,
    "gold" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "userTelegramId" INTEGER NOT NULL,

    CONSTRAINT "forrayDef_pkey" PRIMARY KEY ("time")
);

-- CreateTable
CREATE TABLE "forrayAtk" (
    "time" TIMESTAMP(3) NOT NULL,
    "miss" BOOLEAN NOT NULL,
    "gold" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "userTelegramId" INTEGER NOT NULL,

    CONSTRAINT "forrayAtk_pkey" PRIMARY KEY ("time")
);

-- AddForeignKey
ALTER TABLE "forrayDef" ADD CONSTRAINT "forrayDef_userTelegramId_fkey" FOREIGN KEY ("userTelegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forrayAtk" ADD CONSTRAINT "forrayAtk_userTelegramId_fkey" FOREIGN KEY ("userTelegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;
