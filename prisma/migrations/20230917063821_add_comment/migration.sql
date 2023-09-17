-- AlterTable
ALTER TABLE `topic` ADD COLUMN `Comments` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Comment` (
    `uuid` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `create_time` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `topic_id` VARCHAR(191) NOT NULL,
    `parent_id` VARCHAR(191) NOT NULL,

    INDEX `Comment_user_id_idx`(`user_id`),
    INDEX `Comment_topic_id_idx`(`topic_id`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
