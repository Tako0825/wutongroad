/*
  Warnings:

  - A unique constraint covering the columns `[openid]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `user_openid_key` ON `user`(`openid`);
