// AdminService.ts
/*
import { IAdminRespository } from "../../Interfaces/AdminInterface/interface";
import AdminData from "../../Interfaces/AdminInterface/interface";
import { PrismaClient } from "@prisma/client";
import { MESSAGES } from "../../Utils/Messages/messages";
import { ValidatorProps } from "../../Utils/Validators/validators/validators";

export class AdminService {
  private adminRepository: IAdminRespository;
  private prisma: PrismaClient;

  constructor(adminRepository: IAdminRespository, prismaClient: PrismaClient) {
    this.adminRepository = adminRepository;
    this.prisma = prismaClient;
  }

  async createAdminWithAccount(adminDatas: AdminData, id_conta_fk: string): Promise<AdminData> {
    try {
      const adminDataWithAccount = { ...adminDatas, id_conta_fk };
      const createdAdmin = await this.adminRepository.createAdmin(adminDataWithAccount, this.prisma);

      if (!createdAdmin) {
        throw {message: MESSAGES.ACCOUNT_CREATION_FAILED, success: false, statusCode: 400}
      }
      
      return createdAdmin;
    } catch (error:any) {
      console.error("Erro ao criar administrador:", error);
      throw { message: error.message || MESSAGES.ERROR_INTERNAL, success: false, statusCode: error.statusCode || 500 };
    }
  }

  async findAdmin(id_admin: string): Promise<AdminData | null> {
    if (!id_admin) {
      throw new Error(MESSAGES.INVALID_SEARCH_ID);
    }

    const adminExists = await ValidatorProps.AdminExists(id_admin);
    if (!adminExists) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    const results = await this.adminRepository.findAdmin(id_admin, this.prisma);
    if (!results) {
      throw new Error(MESSAGES.TRY_LATER);
    }

    return results;
  }
}
*/