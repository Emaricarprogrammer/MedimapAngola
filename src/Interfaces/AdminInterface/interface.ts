export default interface AdminData
{
    id_admin?: string 
    username: string,
    nivel_acesso: "admin",
    id_conta_fk: string,
    createdAt?: Date,
    updatedAt?: Date
}
export interface IAdminRespository{
  createAdmin(adminDatas: AdminData): Promise<AdminData>
  //findByEmail(email: string): Promise<AdminData | null>
  findAllAdmin():Promise<any>
  findAdmin(id_admin: string):Promise<any>
  updateAdmin(id_admin: string, adminDatas: Partial<AdminData>): Promise<AdminData>
  deleteAdmin(id_admin: string): Promise<any>
  }

  