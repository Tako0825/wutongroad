/*
  Warnings:

  - The primary key for the `article` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `article` table. All the data in the column will be lost.
  - The primary key for the `category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[category_id]` on the table `article` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `article` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_time` to the `article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `create_time` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `article` DROP FOREIGN KEY `article_categoryId_fkey`;

-- AlterTable
ALTER TABLE `article` DROP PRIMARY KEY,
    DROP COLUMN `categoryId`,
    DROP COLUMN `id`,
    ADD COLUMN `category_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `create_time` DATETIME(3) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`uuid`);

-- AlterTable
ALTER TABLE `category` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`uuid`);

-- AlterTable
ALTER TABLE `user` ADD COLUMN `create_time` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `article_category_id_key` ON `article`(`category_id`);

-- CreateIndex
CREATE UNIQUE INDEX `article_user_id_key` ON `article`(`user_id`);

-- AddForeignKey
ALTER TABLE `article` ADD CONSTRAINT `article_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article` ADD CONSTRAINT `article_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
