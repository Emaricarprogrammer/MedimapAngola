import { PrismaClient } from "@prisma/client";
import { MedicineRepositories } from "../../../Repositories/DepositRepositories/MedicineRepository/MedicineRepository";
import { Request, Response } from "express";

const prisma: PrismaClient = new PrismaClient()
const MedicineRepositoryInstance: MedicineRepositories = new MedicineRepositories(prisma)

export class FindMedicineController
{
    static async FindMedicine(req: Request, res: Response): Promise<Response>
    {
        try {
            const {nome_generico, id} = req.params
            if (!nome_generico)
            {
                return res.status(400).json({success: false, message: "Ooooops! Estamos tentando encontrar este medicamento, por favor tente novamente"})
            }
            const MedicineResult = await MedicineRepositoryInstance.findMedicine(nome_generico)
            if (!MedicineResult)
            {
                return res.status(404).json({success: false, message: "Ooooops! De momento ainda não temos este medicamento na nossa aplicação, por favor tente novamente mais tarde"})
            }
            return res.status(200).json({success: true, response: MedicineResult})
    
        } catch (error) {
            return res.status(500).json({success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde."})
        }
    }
}