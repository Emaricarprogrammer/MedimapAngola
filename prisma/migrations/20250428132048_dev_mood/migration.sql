-- CreateTable
CREATE TABLE `tbl_contas` (
    `id_conta` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tbl_contas_email_key`(`email`),
    PRIMARY KEY (`id_conta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_admin` (
    `id_admin` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `nivel_acesso` ENUM('admin') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `id_conta_fk` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_admin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_entidades` (
    `id_entidade` VARCHAR(191) NOT NULL,
    `NIF_entidade` VARCHAR(191) NOT NULL,
    `firma_entidade` VARCHAR(191) NOT NULL,
    `tipo_entidade` ENUM('farmacia', 'deposito') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `id_conta_fk` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_entidades_NIF_entidade_key`(`NIF_entidade`),
    PRIMARY KEY (`id_entidade`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_geolocalizacao` (
    `id_geolocalizacao` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `id_entidade_fk` VARCHAR(191) NOT NULL,

    INDEX `tbl_geolocalizacao_id_entidade_fkey`(`id_entidade_fk`),
    PRIMARY KEY (`id_geolocalizacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_contactos` (
    `id_contacto` VARCHAR(191) NOT NULL,
    `contacto` INTEGER NOT NULL,
    `id_entidade_fk` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_contactos_contacto_key`(`contacto`),
    INDEX `tbl_contactos_id_entidade_fkey`(`id_entidade_fk`),
    PRIMARY KEY (`id_contacto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_enderecos` (
    `id_endereco` VARCHAR(191) NOT NULL,
    `logradouro` VARCHAR(191) NOT NULL,
    `rua` VARCHAR(191) NOT NULL,
    `numero` INTEGER NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `pais` VARCHAR(191) NOT NULL DEFAULT 'Angola',
    `id_entidade_fk` VARCHAR(191) NOT NULL,

    INDEX `tbl_enderecos_id_entidade_fkey`(`id_entidade_fk`),
    PRIMARY KEY (`id_endereco`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_categoria_medicamentos` (
    `id_categoria_medicamento` VARCHAR(191) NOT NULL,
    `nome_categoria_medicamento` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_categoria_medicamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_medicamentos` (
    `id_medicamento` VARCHAR(191) NOT NULL,
    `nome_generico_medicamento` VARCHAR(191) NOT NULL,
    `nome_comercial_medicamento` VARCHAR(191) NOT NULL,
    `origem_medicamento` VARCHAR(191) NOT NULL,
    `preco_medicamento` DOUBLE NOT NULL,
    `validade_medicamento` DATETIME(3) NOT NULL,
    `imagem_url` VARCHAR(191) NOT NULL,
    `quantidade_disponivel_medicamento` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `id_categoria` VARCHAR(191) NOT NULL,
    `id_entidade_fk` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_medicamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_aquisicao` (
    `id_aquisicao` VARCHAR(191) NOT NULL,
    `quantidade_aquisicao` INTEGER NOT NULL,
    `data_aquisicao` DATETIME(3) NOT NULL,
    `tipo_aquisicao` ENUM('emediata') NOT NULL,
    `total_compra` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `id_entidade_fk` VARCHAR(191) NOT NULL,
    `status` ENUM('pendente', 'concluido', 'cancelado') NULL,

    INDEX `tbl_aquisicao_id_entidade_fkey`(`id_entidade_fk`),
    PRIMARY KEY (`id_aquisicao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_aquisicao_medicamentos` (
    `id_aquisicao_medicamento` VARCHAR(191) NOT NULL,
    `id_medicamento` VARCHAR(191) NOT NULL,
    `id_aquisicao` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_aquisicao_medicamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_recuperacao_senha` (
    `id_recuperacao_senha` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiracao` DATETIME(3) NOT NULL,
    `usado` BOOLEAN NOT NULL,
    `id_conta_fk` VARCHAR(191) NULL,

    UNIQUE INDEX `tbl_recuperacao_senha_token_key`(`token`),
    PRIMARY KEY (`id_recuperacao_senha`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_refreshTokens` (
    `id_refreshToken` VARCHAR(191) NOT NULL,
    `token` TEXT NOT NULL,
    `expiracao` DATETIME(3) NOT NULL,
    `usado` BOOLEAN NULL,
    `id_conta_fk` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_refreshToken`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `tbl_aquisicao_medicamentos` ADD CONSTRAINT `tbl_aquisicao_medicamentos_id_aquisicao_fkey` FOREIGN KEY (`id_aquisicao`) REFERENCES `tbl_aquisicao`(`id_aquisicao`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_aquisicao_medicamentos` ADD CONSTRAINT `tbl_aquisicao_medicamentos_id_medicamento_fkey` FOREIGN KEY (`id_medicamento`) REFERENCES `tbl_medicamentos`(`id_medicamento`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_recuperacao_senha` ADD CONSTRAINT `tbl_recuperacao_senha_id_conta_fk_fkey` FOREIGN KEY (`id_conta_fk`) REFERENCES `tbl_contas`(`id_conta`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_refreshTokens` ADD CONSTRAINT `tbl_refreshTokens_id_conta_fk_fkey` FOREIGN KEY (`id_conta_fk`) REFERENCES `tbl_contas`(`id_conta`) ON DELETE CASCADE ON UPDATE CASCADE;
