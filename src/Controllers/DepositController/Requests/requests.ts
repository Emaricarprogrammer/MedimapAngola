import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { RequestsRepositories } from "../../../Repositories/PharmacyRepository/requestsRepositories"
import validator from "validator"

const prisma: PrismaClient = new PrismaClient()
const RequestsRepositoriesInstane: RequestsRepositories = new RequestsRepositories(prisma)

class RequestsMedicineController
{
    static async request(req: Request, res: Response): Promise<Response>
    {
        try
        {
            const {
                quantidade_aquisicao,
                data_aquisicao,
                tipo_aquisicao,
                id_entidade_fk
            } = req.body
            const fields =
            [
                "quantidade_aquisicao",
                "data_aquisicao",
                "tipo_aquisicao",
                "id_entidade_fk"
            ].filter((field) => !req.body[field])

            if (fields.length > 0)
            {
                return res.status(400).json({
                    success: false,
                    message: "Por favor, verifique se preencheu todos os campos",
                })
            }
            if (!validator.isInt(quantidade_aquisicao))
            {
                return res.status(400).json({
                    success: false,
                    message: "Por favor, verifique se informou correctamente a quantidade de medicamento desejado.",
                })   
            }
            if (!["agendada", "emediata"].includes(tipo_aquisicao))
            {
                return res.status(400).json({
                    success: false,
                    message: "Apenas aceitas aquisições agendadas e emediatas.",
                })
            }

            const request = await RequestsRepositoriesInstane.createRequest(
                {
                    quantidade_aquisicao: quantidade_aquisicao,
                    data_aquisicao: data_aquisicao,
                    tipo_aquisicao: tipo_aquisicao,
                    id_entidade_fk: id_entidade_fk
                }
            )
            if (!request)
            {
                return res.status(400).json({
                    success: false,
                    message: "Ocorreu um problema ao realizar esta operação, por favor tente novamente..",
                })
            }
            return res.status(201).json({success: true, message:"A sua solicitação foi processada com sucesso"})
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." }) 
        }
    }
}
