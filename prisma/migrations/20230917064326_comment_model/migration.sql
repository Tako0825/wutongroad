-- AlterTable
ALTER TABLE `comment` MODIFY `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `parent_id` VARCHAR(191) NULL;
