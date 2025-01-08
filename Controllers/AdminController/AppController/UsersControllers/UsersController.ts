import { Request, response, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient()

export class UsersMagementController
{
    static async CountUsers(req: Request, res: Response):Promise<Response>
    {
        try {
            const Users: number = await prisma.entidades.count()
            if (!Users)
            {
                return res.status(400).json({success: false, message: "Oooops! Não foi possível retornar estes dados, por favor tente novamente."})
            }
            return res.status(200).json({success: true, response: Users})

        } catch (error: any) {
            console.error("Houve um erro: ", error.message)
            return res.status(500).json({success: false, message: "Estamos tentando resolver este problema, tente novamente"})
        }       
    }
}