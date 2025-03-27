-- AlterTable
ALTER TABLE `tbl_aquisicao` ADD COLUMN `status` ENUM('pendente', 'concluido', 'cancelado') NULL;
