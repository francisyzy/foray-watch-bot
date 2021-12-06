/*
  Warnings:

  - The primary key for the `forrayAtk` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `forrayDef` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `trader` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "forrayAtk" DROP CONSTRAINT "forrayAtk_pkey",
ADD CONSTRAINT "forrayAtk_pkey" PRIMARY KEY ("time", "userTelegramId");

-- AlterTable
ALTER TABLE "forrayDef" DROP CONSTRAINT "forrayDef_pkey",
ADD CONSTRAINT "forrayDef_pkey" PRIMARY KEY ("time", "userTelegramId");

-- AlterTable
ALTER TABLE "trader" DROP CONSTRAINT "trader_pkey",
ADD CONSTRAINT "trader_pkey" PRIMARY KEY ("time", "userTelegramId");
