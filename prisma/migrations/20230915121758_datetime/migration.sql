/*
  Warnings:

  - You are about to alter the column `create_time` on the `topic` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- DropIndex
DROP INDEX `topic_category_id_key` ON `topic`;

-- DropIndex
DROP INDEX `topic_user_id_key` ON `topic`;

-- AlterTable
ALTER TABLE `topic` MODIFY `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
