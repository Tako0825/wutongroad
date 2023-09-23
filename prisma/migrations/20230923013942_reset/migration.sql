/*
  Warnings:

  - You are about to drop the column `comments` on the `topic` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `topic` DROP COLUMN `comments`;

-- CreateTable
CREATE TABLE `Broadcast` (
    `uuid` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `notice_id` VARCHAR(191) NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
