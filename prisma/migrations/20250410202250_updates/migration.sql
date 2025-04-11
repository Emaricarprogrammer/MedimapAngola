/*
  Warnings:

  - You are about to alter the column `quantidade_aquisicao` on the `tbl_aquisicao` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `tbl_aquisicao` MODIFY `quantidade_aquisicao` INTEGER NOT NULL;
