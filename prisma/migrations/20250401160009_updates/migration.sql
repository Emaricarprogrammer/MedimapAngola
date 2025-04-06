-- CreateTable
CREATE TABLE `tbl_refreshTokens` (
    `id_refreshToken` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiracao` DATETIME(3) NOT NULL,
    `usado` BOOLEAN NULL,
    `id_conta_fk` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_refreshTokens_token_key`(`token`),
    PRIMARY KEY (`id_refreshToken`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_refreshTokens` ADD CONSTRAINT `tbl_refreshTokens_id_conta_fk_fkey` FOREIGN KEY (`id_conta_fk`) REFERENCES `tbl_contas`(`id_conta`) ON DELETE CASCADE ON UPDATE CASCADE;
