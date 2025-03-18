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
                id_entidade_fk,
                id_medicamento
            } = req.body
            const fields =
            [
                "quantidade_aquisicao",
                "data_aquisicao",
                "tipo_aquisicao",
                "id_entidade_fk",
                "id_medicamento"
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

            const result = await prisma.$transaction(async(tx) => {
                const requestMedicine = await RequestsRepositoriesInstane.createRequest(
                    {
                        quantidade_aquisicao: quantidade_aquisicao,
                        data_aquisicao: data_aquisicao,
                        tipo_aquisicao: tipo_aquisicao,
                        id_entidade_fk: id_entidade_fk
                    }, tx
                )
                if (!requestMedicine)
                {
                    return res.status(400).json({
                        success: false,
                        message: "Ocorreu um problema ao realizar esta operação, por favor tente novamente..",
                    })
                }

                const requestMedicines = await RequestsRepositoriesInstane.createRequestsMedicines({
                    id_aquisicao: requestMedicine.id_aquisicao,
                    id_medicamento: id_medicamento
                }, tx)

                if (!requestMedicines)
                {
                    return res.status(400).json({
                        success: false,
                        message: "Ocorreu um problema ao realizar esta operação, por favor tente novamente..",
                        })
                }
                return {success: true, message: "A sua solicitação foi processada com sucesso"}
            })

            return res.status(201).json(result)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." }) 
        }
    }
}
