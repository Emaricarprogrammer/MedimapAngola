
import { Request, Response } from "express";
import { AdminRepository } from "../../../Repositories/AdminRepository/AdminRepository";
import { PrismaClient } from "@prisma/client";
import dayjs from 'dayjs';

const Prisma = new PrismaClient();
const AdminRepositoryInstance = new AdminRepository(Prisma);
export default class FindAdminController
{
  static async findAdmin(req: Request, res: Response)
  {
    try
    {
      const { id_admin } = req.params;

      if (!id_admin)
      {
        return res.status(400).json({ success: false, message: "Ooooops! Não conseguimos encontrar este usário, por favor tente novamente." });
      }
      const Results = await AdminRepositoryInstance.findAdmin(id_admin);
      if (!Results)
      {
        return res.status(400).json({ success: false, message: "Ooooops! Não conseguimos encontrar este usário, por favor tente novamente." });
      }
      const AdminDatas = {
        id_admin: Results?.id_admin,
        username: Results?.username,
        nivel_acesso: Results?.nivel_acesso,
        email: Results?.email,
        id_conta: Results?.id_conta,
        id_conta_fk: Results?.id_conta_fk,
        createdAt: dayjs(Results?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: dayjs(Results?.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
      }
      return res.status(200).json({ success: true, response: AdminDatas });

    } catch (error: any)
    {
      console.error("Houve um erro: ", error.message);
      return res.status(500).json({ success: false, message:"Estamos tentando resolver este problema por favor, tente novamente mais tarde." });
    }
  }
}
