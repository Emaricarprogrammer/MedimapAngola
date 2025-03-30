import { PrismaClient } from "@prisma/client"
import { Request, response, Response } from "express"
import { RequestsRepositories } from "../../../Repositories/PharmacyRepository/requestsRepositories"
import { sendSMS } from "../../../Utils/providers/SendMessages/SendMessages"
import dayjs, { Dayjs } from "dayjs"

const prisma: PrismaClient = new PrismaClient()
const RequestsRepositoriesInstane: RequestsRepositories = new RequestsRepositories(prisma)

class DepositsOrders
{
    static async getOrders(req: Request, res: Response):Promise<Response>
    {
        try
        {
             const detailsOrders = await RequestsRepositoriesInstane.getOrdersDetails()
             if (detailsOrders == null || !detailsOrders)
             {
                return res.status(500).json({ success: false, message: "Sem pedidos de momento." })
             }
             return res.status(200).json({success: true, response: detailsOrders.allRequests, pagination: detailsOrders.pagination})
        } catch (error)
        {
            console.error("Houve um erro: ", error)
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." })
        }
    }

    static async OrdersStatus(req: Request, res: Response):Promise<Response>
    {
        try
        {
            const {id_aquisicao} = req.params
            const {aquisicao_status, mensagem, contacto_farmacia} = req.body
            if (!id_aquisicao || !aquisicao_status)
            {
                return res.status(400).json({ success: false, message: "Por favor, verifique se preencheu todos os campos" })
            }
            if (!["concluido", "cancelado"].includes(aquisicao_status))
            {
                return res.status(400).json({ success: false, message: "Por favor, verifique se informou correctamente o status do pedido." })
            }
            const existingOrder = await prisma.aquisicao.findUnique({
                where: { id_aquisicao }
            });
    
            if (!existingOrder) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Pedido não encontrado." 
                });
            }
            const status = await prisma.aquisicao.update({where:{id_aquisicao}, data:{status: aquisicao_status}})
            if (!status)
            {
                return res.status(500).json({ success: false, message: "Ocorreu um erro durante esta operação, por favor tente novamente." })
            }
            if (status.status == "cancelado")
            {
                const resultMessage = await sendSMS(contacto_farmacia, mensagem)
                if (resultMessage.success == false)
                {
                    return res.status(500).json({ success: false, message: "Ocorreu um erro ao enviar a mensagem." })
                }
            }
            const resultMessage = await sendSMS(contacto_farmacia, mensagem)
            if (resultMessage.success == false)
            {
                return res.status(500).json({ success: false, message: "Ocorreu um erro ao enviar a mensagem." })
            }
            return res.status(200).json(resultMessage)
        } catch (error)
        {
            console.error("Houve um erro: ", error)
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." })
        }
    }
}

export {DepositsOrders}