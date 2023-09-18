/*
  Warnings:

  - Made the column `type` on table `notice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `notice` MODIFY `content` TEXT NULL,
    MODIFY `type` ENUM('system', 'admin', 'comment') NOT NULL;
