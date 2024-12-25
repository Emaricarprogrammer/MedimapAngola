import { PrismaClient, Prisma} from "@prisma/client"
import { IAccountRepository, AccountData, AccountDatasResponse } from '../../Interfaces/AccountInterface/interface';
import { PasswordService } from "../../Utils/PasswordService/passwordService";

export class AccountRepository implements IAccountRepository
{
    private Prisma: PrismaClient
    constructor(prisma: PrismaClient)
    {
        this.Prisma = prisma
    }
    async createAccount(AccountDatas: AccountData):Promise<AccountDatasResponse>
    {
        const HashPassword = await PasswordService.hashPassword(AccountDatas.password)
        const accountData = await this.Prisma.contas.create({data:{...AccountDatas, password: HashPassword}})
        return{
            id_conta: accountData.id_conta,
            email: accountData.email
        }
    }
    async updateAccount(id_account: string, datas: Partial<AccountData>): Promise<AccountDatasResponse>
    {
        const results = await this.Prisma.contas.update({where:{id_conta: id_account}, data:{...datas}})
        return {
            id_conta: results.id_conta,
            email: results.email
        }
    }
    async deleteAccount(id_account: string)
    {
        const accountDeleted = await this.Prisma.contas.delete({where:{id_conta: id_account}})
        return accountDeleted
    }
    async findAccount(email: string)
    {
        const AccountResults = await this.Prisma.contas.findUnique({where:{email: email}})
        return {
            id_conta: AccountResults?.id_conta,
            email: AccountResults?.email
        }
    }
    
}