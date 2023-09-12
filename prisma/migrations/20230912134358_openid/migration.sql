/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - Added the required column `openid` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_key` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `name`,
    ADD COLUMN `openid` VARCHAR(191) NOT NULL,
    ADD COLUMN `session_key` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`openid`);
