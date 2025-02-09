"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepository = void 0;
const passwordService_1 = require("../../Utils/PasswordService/passwordService");
class AccountRepository {
    constructor(prisma) {
        this.Prisma = prisma;
    }
    async createAccount(AccountDatas, tx) {
        const HashPassword = await passwordService_1.PasswordService.hashPassword(AccountDatas.password);
        const prismaClient = tx || this.Prisma;
        const accountData = await prismaClient.contas.create({ data: { ...AccountDatas, password: HashPassword } });
        return {
            id_conta: accountData.id_conta,
            email: accountData.email
        };
    }
    async updateAccount(id_account, datas, tx) {
        const prismaClient = tx || this.Prisma;
        const results = await prismaClient.contas.update({ where: { id_conta: id_account }, data: { ...datas } });
        return results;
    }
    async deleteAccount(id_account) {
        const accountDeleted = await this.Prisma.contas.delete({ where: { id_conta: id_account } });
        return accountDeleted;
    }
    async findAccount(email) {
        const AccountResults = await this.Prisma.contas.findUnique({ where: { email: email } });
        return {
            id_conta: AccountResults?.id_conta,
            email: AccountResults?.email
        };
    }
}
exports.AccountRepository = AccountRepository;
