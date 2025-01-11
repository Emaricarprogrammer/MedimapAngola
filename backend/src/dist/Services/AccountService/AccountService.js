"use strict";
/*
import { AccountData, IAccountRepository } from '../../Interfaces/AccountInterface/interface'
import { ValidatorProps } from '../../Utils/Validators/validators/validators'
import { MESSAGES } from '../../Utils/Messages/messages'
import { PasswordService } from '../../Utils/PasswordService/passwordService'
import { PrismaClient, Prisma } from '@prisma/client'

type PrismaInstance = PrismaClient | Prisma.TransactionClient;

export class AccountService {
  private accountRepository: IAccountRepository;
  private prisma: PrismaClient

  constructor(accountRepository: IAccountRepository, prisma: PrismaClient) {
    this.accountRepository = accountRepository;
    this.prisma = prisma;
  }

  async CreateAccount(accountDatas: AccountData, prisma: PrismaInstance): Promise<AccountData> {
    try {
      
      if (!accountDatas.email || !accountDatas.password) {
        console.error("Campos vazios");
        throw { message: MESSAGES.EMPTY_DATAS, success: false, statusCode: 400 };
      }
      ValidatorProps.validateEmail(accountDatas.email)
      const existingAccount = await ValidatorProps.EmailExists(accountDatas.email);
      if (existingAccount) {
        console.log("Este email já está em uso");
        throw { message: MESSAGES.ERROR_EMAIL_EXISTS, success: false, statusCode: 400 };
      }

      const RegexPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
      if (!RegexPassword.test(accountDatas.password)) {
        console.log("Senha não segura");
        throw { message: MESSAGES.ERROR_PASSWORD_NOT_SECURE, success: false, statusCode: 400 };
      }
      const hashedPassword = await PasswordService.hashPassword(accountDatas.password);
      const account = await this.accountRepository.create({ ...accountDatas, password: hashedPassword }, prisma);

      console.log("Dados da conta criada:", account);

      return account;
    } catch (error: any)
    {
      console.error("Erro ao cadastrar a conta: ", error);
      throw { message: error.message || MESSAGES.ERROR_INTERNAL, success: false, statusCode: error.statusCode || 500 };
    }
  }

  async Update(id_account:string, datas: Partial<AccountData>):Promise<AccountData>
  {
    try {
      if (!id_account || !datas.email || !datas.password)
      {
        throw {message:MESSAGES.EMPTY_UPDATE_FILES, success:false, statusCode:400}
      }

      const HashedPassword = PasswordService.hashPassword(datas.password)
      const existingAccount = await this.prisma.contas.findUnique({where:{id_conta:id_account}})
      if (!existingAccount)
      {
        throw {message:MESSAGES.USER_NOT_FOUND, success: false, statusCode:400}
      }
      const updatedAccount = await this.accountRepository.update(id_account, datas,)
      if (!updatedAccount)
      {
        throw {message: MESSAGES.UNSUCCESS_UPDATED_DATA, success:false, statusCode:400}
      }
      return updatedAccount
      
    } catch (error:any) {
      console.error("Erro ao actualizar esta conta a conta: ", error);
      throw { message: error.message || MESSAGES.ERROR_INTERNAL, success: false, statusCode: error.statusCode || 500 };
    }
  }
}
*/ 
