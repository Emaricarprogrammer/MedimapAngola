import { PrismaClient } from "@prisma/client";
import { MedicineRepositories } from "../../../Repositories/DepositRepositories/MedicineRepository/MedicineRepository";
import { Request, Response } from "express";

const prisma: PrismaClient = new PrismaClient()
const MedicineRepositoryInstance: MedicineRepositories = new MedicineRepositories(prisma)

export class FindAllMedicinesController
{
    static async FindMedicines(req: Request, res: Response): Promise<Response>
    {
        try
        {

            const MedicineResult = await MedicineRepositoryInstance.findAllMedicine()
            if (MedicineResult.MedicineResults.length ==0)
            {
                return res.status(200).json({success: true, message: "Ooooops! De momento estamos sem medicamentos."})
            }
          
            return res.status(200).json({success: true, response: MedicineResult.MedicineResults, pagination: MedicineResult.pagination})
    
        } catch (error) {
            return res.status(500).json({success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde."})
        }
    }
}