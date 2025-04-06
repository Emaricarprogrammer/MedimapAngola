-- DropIndex
DROP INDEX `tbl_refreshTokens_token_key` ON `tbl_refreshtokens`;

-- AlterTable
ALTER TABLE `tbl_refreshtokens` MODIFY `token` TEXT NOT NULL;
