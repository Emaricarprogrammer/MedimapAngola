-- CreateTable
CREATE TABLE `Recuperacao_senha` (
    `id_recuperacao_senha` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiracao` DATETIME(3) NOT NULL,
    `usado` BOOLEAN NOT NULL,
    `id_conta_fk` VARCHAR(191) NULL,

    UNIQUE INDEX `Recuperacao_senha_token_key`(`token`),
    PRIMARY KEY (`id_recuperacao_senha`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Recuperacao_senha` ADD CONSTRAINT `Recuperacao_senha_id_conta_fk_fkey` FOREIGN KEY (`id_conta_fk`) REFERENCES `tbl_contas`(`id_conta`) ON DELETE SET NULL ON UPDATE CASCADE;
