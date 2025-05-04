import { GeneralDepositsRepositories } from "../../Repositories/DepositRepositories/generalRepositories"
import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"

class GetMyDatasController
{
    private static DepositsRepositoriesInstance: GeneralDepositsRepositories = new GeneralDepositsRepositories(new PrismaClient())

    static async getMyDatas(req: Request, res: Response): Promise<Response>
    {
        try
        {
            const {id_deposito} = req.params
            if (!id_deposito)
            {
                return res.status(400).json({success: false, message: "Campos inválidos."})
            }
            const result = await this.DepositsRepositoriesInstance.findMyDatas(id_deposito)
            if (!result)
            {
                return res.status(400).json({success: false, message: "Não conseguimos encontrar este depósito."})
            }
            return res.status(200).json({success: true, response: result.depositDatas})
        } catch (error)
        {
            console.error(error)
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." })
        }
    }
}   

export {GetMyDatasController}