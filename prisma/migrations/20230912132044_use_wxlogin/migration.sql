/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `password`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
