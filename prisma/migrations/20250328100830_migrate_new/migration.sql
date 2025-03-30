/*
  Warnings:

  - Added the required column `total_compra` to the `tbl_aquisicao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tbl_aquisicao` ADD COLUMN `total_compra` DOUBLE NOT NULL;
