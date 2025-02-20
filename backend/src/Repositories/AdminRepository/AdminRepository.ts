import { IAdminRespository } from '../../Interfaces/AdminInterface/interface'
import AdminData from '../../Interfaces/AdminInterface/interface'
import { AccountData } from '../../Interfaces/AccountInterface/interface';
import { PrismaClient, Prisma } from '@prisma/client';

export class AdminRepository implements IAdminRespository {
  private Prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.Prisma = prisma
  }
  async createAdmin(adminDatas: AdminData, tx?: Omit<Prisma.TransactionClient, '$transaction'>): Promise<AdminData> {
    const prismaClient = tx || this.Prisma
      const adminData = await prismaClient.admin.create({data:{...adminDatas}})
      return adminData
  }
  async findAdmin(id_admin: string): Promise<any> {
    const adminResults = await this.Prisma.admin.findUnique({
      where:{id_admin: id_admin},
      include:{credenciais_admin:true}
    })
    if (adminResults == null)
    {
      return null
    }
    const AdminDatasResponse = {
      id_admin: adminResults?.id_admin,
      username: adminResults?.username,
      email: adminResults?.credenciais_admin.email,
      nivel_acesso: adminResults?.nivel_acesso,
      id_conta_fk: adminResults?.id_conta_fk,
      createdAt: adminResults?.createdAt,
      updatedAt: adminResults?.updatedAt
    }
    return AdminDatasResponse
    
  }
  async findAllAdmin():Promise<any>
  {
    const AdminsResults = await this.Prisma.admin.findMany({
      include:{
        credenciais_admin: true
      }
    })
    if (AdminsResults == null)
    {
      return null
    }
    return AdminsResults.map(admins => ({
      id_admin: admins.id_admin,
      username: admins.username,
      email: admins.credenciais_admin.email,
      nivel_acesso: admins.nivel_acesso,
      id_conta_fk: admins.id_conta_fk,
      createdAt: admins.createdAt,
      updatedAt: admins.updatedAt,
    }))
  }

  async updateAdmin(id_admin:string, adminData: Partial<AdminData>): Promise<AdminData>
  {
    const adminUpdated = await this.Prisma.admin.update({where:{id_admin: id_admin},data:{...adminData}})
    return adminUpdated
  }

  async deleteAdmin(id_admin: string):Promise<any>
  {
     const adminDeleted = await this.Prisma.admin.delete({where:{id_admin: id_admin}})
     return adminDeleted
  }
}

