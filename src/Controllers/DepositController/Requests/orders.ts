import { PrismaClient } from "@prisma/client"
import { Request, response, Response } from "express"
import { RequestsRepositories } from "../../../Repositories/PharmacyRepository/requestsRepositories"
import { sendSMS } from "../../../Utils/providers/SendMessages/SendMessages"
import dayjs, { Dayjs } from "dayjs"
import { ValidatorProps } from "../../../Utils/Validators/validators/validators"

const prisma: PrismaClient = new PrismaClient()
const RequestsRepositoriesInstane: RequestsRepositories = new RequestsRepositories(prisma)
class DepositsOrders
{
    static async getOrders(req: Request, res: Response):Promise<Response>
    {
        try
        {
            const {id_deposito} = req.params

            if (!id_deposito)
            {
                return res.status(400).json({ success: false, message: "Por favor, informe todos os campos" })
            }
            if (!await ValidatorProps.EntityExists(id_deposito))
            {
                return res.status(400).json({ success: false, message: "Desculpe, mas não conseguimos encontar este depósito." })
            }

            if (req.body.user.id_entidade != id_deposito)
            {
                return res.status(401).json({ success: false, message: "Desculpe, mas não podemos realizar está acção detetamos uma falha. Por favor faça login novamente ou tente mais tarde" })
            }
             const detailsOrders = await RequestsRepositoriesInstane.getOrdersDetails(id_deposito)
             if (!detailsOrders || detailsOrders.allRequests.length == 0)
             {
                return res.status(400).json({ success: false, message: "Sem pedidos de momento." })
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