/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `uuid` to the `user` table without a default value. This is not possible if the table is not empty.
  - Made the column `role` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL,
    MODIFY `role` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`uuid`);
