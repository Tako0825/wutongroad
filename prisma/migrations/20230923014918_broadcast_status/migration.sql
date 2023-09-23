/*
  Warnings:

  - You are about to drop the column `is_read` on the `broadcast` table. All the data in the column will be lost.
  - You are about to drop the column `notice_id` on the `broadcast` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `broadcast` table. All the data in the column will be lost.
  - Added the required column `content` to the `Broadcast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `Broadcast` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `notice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recipient_id` on table `notice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `broadcast` DROP COLUMN `is_read`,
    DROP COLUMN `notice_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `content` TEXT NOT NULL,
    ADD COLUMN `sender_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `notice` MODIFY `content` TEXT NOT NULL,
    MODIFY `recipient_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `BroadcastStatus` (
    `uuid` VARCHAR(191) NOT NULL,
    `recipient_id` VARCHAR(191) NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
