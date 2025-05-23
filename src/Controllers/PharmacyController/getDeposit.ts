import { PrismaClient } from "@prisma/client"
import { EntitiesRepositories } from "../../Repositories/EntityRepository/EntityRepository"
import { Request, Response } from "express"
import { ValidatorProps } from "../../Utils/Validators/validators/validators"
import { GeneralDepositsRepositories } from "../../Repositories/DepositRepositories/generalRepositories"

const prisma: PrismaClient = new PrismaClient()

class GetDepositController
{
    private static DepositsRepositoriesInstance: GeneralDepositsRepositories = new GeneralDepositsRepositories(prisma)

    static async getDeposit(req: Request, res: Response): Promise<Response>
    {
        try
        {
            const {id_deposito} = req.params
            if (!id_deposito)
            {
                return res.status(400).json({success: false, message: "Campos inválidos."})
            }
             const result = await this.DepositsRepositoriesInstance.findDeposit(id_deposito)
             if (!result)
             {
                return res.status(400).json({success: false, message: "Não conseguimos encontrar este depósito."})
             }
             return res.status(200).json({success: true, response: result.depositDatas, pagination: result.pagination})
        } catch (error)
        {
            console.error(error)
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." })
        }
    }
}

export {GetDepositController}