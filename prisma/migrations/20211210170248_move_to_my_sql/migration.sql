-- CreateTable
CREATE TABLE `User` (
    `telegramId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `timeZone` INTEGER NOT NULL DEFAULT 8,
    `forayAtkHit` INTEGER NOT NULL DEFAULT 0,
    `forayAtkMiss` INTEGER NOT NULL DEFAULT 0,
    `atkXp` INTEGER NOT NULL DEFAULT 0,
    `atkGold` INTEGER NOT NULL DEFAULT 0,
    `atkGoldLost` INTEGER NOT NULL DEFAULT 0,
    `forayDefHit` INTEGER NOT NULL DEFAULT 0,
    `forayDefMiss` INTEGER NOT NULL DEFAULT 0,
    `defXp` INTEGER NOT NULL DEFAULT 0,
    `defGold` INTEGER NOT NULL DEFAULT 0,
    `traderHit` INTEGER NOT NULL DEFAULT 0,
    `traderXp` INTEGER NOT NULL DEFAULT 0,
    `traderGold` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`telegramId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `forayDef` (
    `time` DATETIME(3) NOT NULL,
    `miss` BOOLEAN NOT NULL,
    `gold` INTEGER NOT NULL,
    `xp` INTEGER NOT NULL,
    `userTelegramId` INTEGER NOT NULL,

    PRIMARY KEY (`time`, `userTelegramId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `forayAtk` (
    `time` DATETIME(3) NOT NULL,
    `miss` BOOLEAN NOT NULL,
    `gold` INTEGER NOT NULL,
    `xp` INTEGER NOT NULL,
    `userTelegramId` INTEGER NOT NULL,

    PRIMARY KEY (`time`, `userTelegramId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trader` (
    `time` DATETIME(3) NOT NULL,
    `gold` INTEGER NOT NULL,
    `xp` INTEGER NOT NULL,
    `userTelegramId` INTEGER NOT NULL,

    PRIMARY KEY (`time`, `userTelegramId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `forayDef` ADD CONSTRAINT `forayDef_userTelegramId_fkey` FOREIGN KEY (`userTelegramId`) REFERENCES `User`(`telegramId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `forayAtk` ADD CONSTRAINT `forayAtk_userTelegramId_fkey` FOREIGN KEY (`userTelegramId`) REFERENCES `User`(`telegramId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trader` ADD CONSTRAINT `trader_userTelegramId_fkey` FOREIGN KEY (`userTelegramId`) REFERENCES `User`(`telegramId`) ON DELETE RESTRICT ON UPDATE CASCADE;
