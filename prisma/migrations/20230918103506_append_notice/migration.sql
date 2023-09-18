/*
  Warnings:

  - You are about to alter the column `recipient_id` on the `notice` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - Added the required column `type` to the `Notice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notice` ADD COLUMN `type` ENUM('system', 'admin', 'comment') NOT NULL,
    MODIFY `recipient_id` VARCHAR(191) NOT NULL;
