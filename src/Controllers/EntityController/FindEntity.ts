import {PrismaClient} from "@prisma/client"
import { EntitiesRepositories } from "../../Repositories/EntityRepository/EntityRepository"
import { Request, Response } from "express"
import { ValidatorProps } from "../../Utils/Validators/validators/validators"

const prisma: PrismaClient = new PrismaClient()

class FindEntityController
{
    private static entitiesRepositoriesInstance: EntitiesRepositories = new EntitiesRepositories(prisma)

    static async findEntity(req: Request, res: Response): Promise<Response>
    {
        try
        {
            const {id_entidade} = req.params
            if (!id_entidade)
            {
                return res.status(400).json({success: false, message: "Campos inválidos."})
            }
            if (! await ValidatorProps.EntityExists(id_entidade))
             {
                return res.status(400).json({success: false, message: "Usúario não encontrado"})
             }

             const result = await this.entitiesRepositoriesInstance.findEntity(id_entidade)
             if (!result || result == null)
             {
                return res.status(400).json({success: false, message: "Ocorreu um erro ao retornar este usúario."})
             }
             return res.status(200).json({success: true, response: result})
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." })
        }
    }
}

export {FindEntityController}