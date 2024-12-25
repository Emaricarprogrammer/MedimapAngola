"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepository = void 0;
const passwordService_1 = require("../../Utils/PasswordService/passwordService");
class AccountRepository {
    constructor(prisma) {
        this.Prisma = prisma;
    }
    async createAccount(AccountDatas) {
        const HashPassword = await passwordService_1.PasswordService.hashPassword(AccountDatas.password);
        const accountData = await this.Prisma.contas.create({ data: { ...AccountDatas, password: HashPassword } });
        return {
            id_conta: accountData.id_conta,
            email: accountData.email
        };
    }
    async updateAccount(id_account, datas) {
        const results = await this.Prisma.contas.update({ where: { id_conta: id_account }, data: { ...datas } });
        return {
            id_conta: results.id_conta,
            email: results.email
        };
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
