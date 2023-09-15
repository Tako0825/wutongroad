/*
  Warnings:

  - The primary key for the `category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `category` table. All the data in the column will be lost.
  - The primary key for the `topic` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `topic` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `create_time` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - Made the column `avatar` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `topic` DROP FOREIGN KEY `Topic_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `topic` DROP FOREIGN KEY `Topic_user_id_fkey`;

-- DropIndex
DROP INDEX `Category_uuid_key` ON `category`;

-- DropIndex
DROP INDEX `Topic_uuid_key` ON `topic`;

-- DropIndex
DROP INDEX `User_uuid_key` ON `user`;

-- AlterTable
ALTER TABLE `category` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`uuid`);

-- AlterTable
ALTER TABLE `topic` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`uuid`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `gender` VARCHAR(191) NULL,
    MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    MODIFY `nickname` VARCHAR(191) NOT NULL DEFAULT 'uu',
    MODIFY `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `avatar` VARCHAR(191) NOT NULL DEFAULT 'https://c-ssl.duitang.com/uploads/item/201912/25/20191225224833_zloky.jpg',
    ADD PRIMARY KEY (`uuid`);
