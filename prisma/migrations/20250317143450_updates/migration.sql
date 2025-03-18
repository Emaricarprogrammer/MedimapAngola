/*
  Warnings:

  - You are about to alter the column `NIF_entidade` on the `tbl_entidades` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `tbl_entidades` MODIFY `NIF_entidade` INTEGER NOT NULL;
