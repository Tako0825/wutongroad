/*
  Warnings:

  - The values [system] on the enum `Notice_type` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `sender_id` on table `notice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `notice` MODIFY `sender_id` VARCHAR(191) NOT NULL,
    MODIFY `recipient_id` VARCHAR(191) NULL,
    MODIFY `type` ENUM('admin', 'comment') NOT NULL;
