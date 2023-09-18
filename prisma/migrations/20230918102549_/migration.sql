/*
  Warnings:

  - You are about to drop the column `Comments` on the `topic` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `topic` DROP COLUMN `Comments`,
    ADD COLUMN `comments` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Notice` (
    `uuid` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `sender_id` VARCHAR(191) NULL,
    `recipient_id` ENUM('system', 'comment', 'like') NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
