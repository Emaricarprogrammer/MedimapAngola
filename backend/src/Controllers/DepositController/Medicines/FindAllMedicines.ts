import { PrismaClient } from "@prisma/client";
import { MedicineRepositories } from "../../../Repositories/DepositRepositories/MedicineRepository/MedicineRepository";
import { Request, Response } from "express";

const prisma: PrismaClient = new PrismaClient()
const MedicineRepositoryInstance: MedicineRepositories = new MedicineRepositories(prisma)

export class FindAllMedicinesController
{
    static async FindMedicines(req: Request, res: Response): Promise<Response>
    {
        try {
            const {page = 1, limit = 10} = req.query
            const pageNumer = parseInt(page as string, 10)
            const pageSize = parseInt(limit as string, 10)
            const skip = (pageNumer - 1) * pageSize
            
            
            const MedicineResult = await MedicineRepositoryInstance.findAllMedicine(skip, pageSize)
            if (!MedicineResult)
            {
                return res.status(404).json({success: false, message: "Ooooops! Infelizmente não conseguimos encontrar este medicamento"})
            }
          
            return res.status(200).json({success: true, response: MedicineResult})
    
        } catch (error) {
            return res.status(500).json({success: false, message: "Estamos tentando solucionar este problema"})
        }
    }
}