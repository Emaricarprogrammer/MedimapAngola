import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { GeneralDepositsRepositories } from "../../../Repositories/DepositRepositories/generalRepositories";

const prisma: PrismaClient = new PrismaClient()
const deposistRepositoryInstance: GeneralDepositsRepositories = new GeneralDepositsRepositories(prisma)

export class FindAllMyMedicinesController
{
    static async FindMedicines(req: Request, res: Response): Promise<Response>
    {
        try
        {
            const {id_deposito} = req.params
            if (!id_deposito)
            {
                return res.status(400).json({success: false, message: "Depósito não encontrado!"})
            }
            
            const MedicineResult = await deposistRepositoryInstance.MyMedicines(id_deposito)
            if (!MedicineResult || MedicineResult.medicines.length == 0)
            {
                return res.status(400).json({success: false, message: "Não conseguimos retornar os seus medicamentos, tente novamente!"})
            }
            return res.status(200).json({success: true, response: MedicineResult.medicines, pagination: MedicineResult.pagination})
    
        } catch (error)
        {
            return res.status(500).json({success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde."})
        }
    }
}