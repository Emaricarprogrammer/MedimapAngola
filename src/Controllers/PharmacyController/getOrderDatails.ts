import { PrismaClient } from "@prisma/client"
import { Request, response, Response } from "express"
import { RequestsRepositories } from "../../Repositories/PharmacyRepository/requestsRepositories"

import dayjs, { Dayjs } from "dayjs"
import { ValidatorProps } from "../../Utils/Validators/validators/validators"

const prisma: PrismaClient = new PrismaClient()
const RequestsRepositoriesInstane: RequestsRepositories = new RequestsRepositories(prisma)

class PharmacyOrders
{
    static async getOrders(req: Request, res: Response):Promise<Response>
    {
        try
        {
            const {id_farmacia} = req.params
            if (!await ValidatorProps.EntityExists(id_farmacia))
            {
                return res.status(400).json({ success: false, message: "Farmácia não encontrada." })
            }
             const detailsOrders = await RequestsRepositoriesInstane.getOrdersDetailsPharmacy(id_farmacia)
             if (detailsOrders == null || !detailsOrders)
             {
                return res.status(200).json({ success: false, message: "Sem pedidos de momento." })
             }
             return res.status(200).json({success: true, response: detailsOrders})
        } catch (error)
        {
            console.error("Houve um erro: ", error)
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." })
        }
    }
}

export {PharmacyOrders}