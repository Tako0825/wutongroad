/*
  Warnings:

  - Added the required column `notice_id` to the `BroadcastStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `broadcaststatus` ADD COLUMN `notice_id` VARCHAR(191) NOT NULL;
