/*
  Warnings:

  - You are about to drop the `article` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `article` DROP FOREIGN KEY `article_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `article` DROP FOREIGN KEY `article_user_id_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `avatar` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `article`;

-- CreateTable
CREATE TABLE `topic` (
    `uuid` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `create_time` DATETIME(3) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `topic_category_id_key`(`category_id`),
    UNIQUE INDEX `topic_user_id_key`(`user_id`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `topic` ADD CONSTRAINT `topic_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `topic` ADD CONSTRAINT `topic_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
