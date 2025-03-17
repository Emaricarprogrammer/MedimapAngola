-- DropForeignKey
ALTER TABLE `tbl_admin` DROP FOREIGN KEY `tbl_admin_id_conta_fk_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_aquisicao` DROP FOREIGN KEY `tbl_aquisicao_id_entidade_fk_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_aquisicao_medicamentos` DROP FOREIGN KEY `tbl_aquisicao_medicamentos_id_medicamento_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_contactos` DROP FOREIGN KEY `tbl_contactos_id_entidade_fk_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_enderecos` DROP FOREIGN KEY `tbl_enderecos_id_entidade_fk_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_entidades` DROP FOREIGN KEY `tbl_entidades_id_conta_fk_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_geolocalizacao` DROP FOREIGN KEY `tbl_geolocalizacao_id_entidade_fk_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_medicamentos` DROP FOREIGN KEY `tbl_medicamentos_id_categoria_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_medicamentos` DROP FOREIGN KEY `tbl_medicamentos_id_entidade_fk_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_recuperacao_senha` DROP FOREIGN KEY `tbl_recuperacao_senha_id_conta_fk_fkey`;

-- DropIndex
DROP INDEX `tbl_admin_id_conta_fk_fkey` ON `tbl_admin`;

-- DropIndex
DROP INDEX `tbl_aquisicao_medicamentos_id_medicamento_fkey` ON `tbl_aquisicao_medicamentos`;

-- DropIndex
DROP INDEX `tbl_entidades_id_conta_fk_fkey` ON `tbl_entidades`;

-- DropIndex
DROP INDEX `tbl_medicamentos_id_categoria_fkey` ON `tbl_medicamentos`;

-- DropIndex
DROP INDEX `tbl_medicamentos_id_entidade_fk_fkey` ON `tbl_medicamentos`;

-- DropIndex
DROP INDEX `tbl_recuperacao_senha_id_conta_fk_fkey` ON `tbl_recuperacao_senha`;

-- AddForeignKey
ALTER TABLE `tbl_admin` ADD CONSTRAINT `tbl_admin_id_conta_fk_fkey` FOREIGN KEY (`id_conta_fk`) REFERENCES `tbl_contas`(`id_conta`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_entidades` ADD CONSTRAINT `tbl_entidades_id_conta_fk_fkey` FOREIGN KEY (`id_conta_fk`) REFERENCES `tbl_contas`(`id_conta`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_geolocalizacao` ADD CONSTRAINT `tbl_geolocalizacao_id_entidade_fk_fkey` FOREIGN KEY (`id_entidade_fk`) REFERENCES `tbl_entidades`(`id_entidade`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_contactos` ADD CONSTRAINT `tbl_contactos_id_entidade_fk_fkey` FOREIGN KEY (`id_entidade_fk`) REFERENCES `tbl_entidades`(`id_entidade`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_enderecos` ADD CONSTRAINT `tbl_enderecos_id_entidade_fk_fkey` FOREIGN KEY (`id_entidade_fk`) REFERENCES `tbl_entidades`(`id_entidade`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_medicamentos` ADD CONSTRAINT `tbl_medicamentos_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `tbl_categoria_medicamentos`(`id_categoria_medicamento`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_medicamentos` ADD CONSTRAINT `tbl_medicamentos_id_entidade_fk_fkey` FOREIGN KEY (`id_entidade_fk`) REFERENCES `tbl_entidades`(`id_entidade`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_aquisicao` ADD CONSTRAINT `tbl_aquisicao_id_entidade_fk_fkey` FOREIGN KEY (`id_entidade_fk`) REFERENCES `tbl_entidades`(`id_entidade`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_aquisicao_medicamentos` ADD CONSTRAINT `tbl_aquisicao_medicamentos_id_medicamento_fkey` FOREIGN KEY (`id_medicamento`) REFERENCES `tbl_medicamentos`(`id_medicamento`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_recuperacao_senha` ADD CONSTRAINT `tbl_recuperacao_senha_id_conta_fk_fkey` FOREIGN KEY (`id_conta_fk`) REFERENCES `tbl_contas`(`id_conta`) ON DELETE CASCADE ON UPDATE CASCADE;
