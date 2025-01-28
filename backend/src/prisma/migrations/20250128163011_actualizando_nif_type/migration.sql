/*
  Warnings:

  - A unique constraint covering the columns `[NIF_entidade]` on the table `tbl_entidades` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `tbl_entidades` MODIFY `NIF_entidade` BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `tbl_entidades_NIF_entidade_key` ON `tbl_entidades`(`NIF_entidade`);
