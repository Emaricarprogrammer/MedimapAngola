import { PrismaClient } from "@prisma/client"
import { EntitiesRepositories } from "../../Repositories/EntityRepository/EntityRepository"
import { Request, Response } from "express"
import { ValidatorProps } from "../../Utils/Validators/validators/validators"
import { GeneralDepositsRepositories } from "../../Repositories/DepositRepositories/generalRepositories"

const prisma: PrismaClient = new PrismaClient()

class MyProfileController
{
    private static DepositsRepositoriesInstance: GeneralDepositsRepositories = new GeneralDepositsRepositories(prisma)

    static async myProfile(req: Request, res: Response): Promise<Response>
    {
        try
        {
            const {id_deposito} = req.params
            if (!id_deposito)
            {
                return res.status(400).json({success: false, message: "Campos inválidos."})
            }
            if (! await ValidatorProps.EntityExists(id_deposito))
             {
                return res.status(400).json({success: false, message: "Usúario não encontrado"})
             }

             const result = await this.DepositsRepositoriesInstance.findDeposit(id_deposito)
             if (!result || result == null)
             {
                return res.status(400).json({success: false, message: "Ocorreu um erro ao retornar este usúario."})
             }
             return res.status(200).json({success: true, response: result.depositDatas, pagination: result.pagination})
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." })
        }
    }
}

export {MyProfileController}