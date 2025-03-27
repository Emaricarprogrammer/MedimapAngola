import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { RequestsRepositories } from "../../../Repositories/PharmacyRepository/requestsRepositories"
import validator from "validator"
import dayjs, { Dayjs } from "dayjs"

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
                id_entidade_fk,
                id_medicamento
            } = req.body
            console.log(req.body)
            const fields =
            [
                "quantidade_aquisicao",
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
                console.log("aqui")
                return res.status(400).json({
                    success: false,
                    message: "Por favor, verifique se informou correctamente a quantidade de medicamento desejado.",
                })   
            }
            const result = await prisma.$transaction(async(tx) => {
                const requestMedicine = await RequestsRepositoriesInstane.createRequest(
                    {
                        quantidade_aquisicao: quantidade_aquisicao,
                        data_aquisicao: new Date,
                        tipo_aquisicao: "emediata",
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

                const result = {
                    id_aquisicao: requestMedicine.id_aquisicao,
                    quantidade_aquisicao: requestMedicine.quantidade_aquisicao,
                    data_aquisicao: dayjs(requestMedicine.data_aquisicao).format("DD:MM:YY: HH:MM:ss"),
                    id_entidade_fk: requestMedicine.id_entidade_fk,
                    id_medicamento: requestMedicines.id_medicamento

                }
                return {success: true, message: "A sua solicitação foi processada com sucesso", respose: result }
            }, {timeout: 10000})

            return res.status(201).json(result)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." }) 
        }
    }
}
export {RequestsMedicineController}