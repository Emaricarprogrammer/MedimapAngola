import { Request, Response } from "express";
import { AdminRepository } from "../../../Repositories/AdminRepository/AdminRepository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
const AdminRepositoryInstance = new AdminRepository(prisma)

export class FindAllAdminsController
{
    static async findAllAdmin(req: Request, res: Response)
    {
        try
        {
            const AdminsDatas = await AdminRepositoryInstance.findAllAdmin()
            if(!AdminsDatas)
            {
                return res.status(400).json({success: false, message:"Ooooooops! Não foi possível encontrar estes usuário, por favor tente novamente"})
            }
            if(AdminsDatas === null)
            {
                return res.status(400).json({success: false, message:"Não foi possível encontrar estes usuário, por favor tente novamente"})
            }
            return res.status(200).json({success: 200, response: AdminsDatas})
        }
        catch(error: any)
        {
            console.log("Houve um erro: ", error.message)
            return res.status(500).json({success: false, message:"Estamos tentando resolver este problema por favor, tente novamente mais tarde." })
        }
    }
}