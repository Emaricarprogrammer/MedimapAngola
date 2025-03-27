import { Request, response, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dayjs from 'dayjs';

const prisma: PrismaClient = new PrismaClient()

class UsersMagementController
{
    static async CountUsers(req: Request, res: Response):Promise<Response>
    {
        try {
            const Users: number = await prisma.entidades.count()
            if (!Users)
            {
                return res.status(400).json({success: false, message: "Oooops! Não foi possível retornar estes dados, por favor tente novamente."})
            }

            return res.status(200).json({success: true,message:"Total de contas no sistema",response: Users})

        } catch (error: any)
        {
            console.error("Houve um erro: ", error.message)
            return res.status(500).json({success: false, message: "Estamos tentando resolver este problema, tente novamente"})
        }       
    }

    static async AllEntities(req: Request, res: Response):Promise<Response>
    {
        try
        {
            const allEntities = await prisma.entidades.findMany({include:{contacto_entidade: true, geolocalizacao_entidade: true, endereco_entidade: true, credenciais_entidades: true}})
            if (allEntities == null)
            {
                return res.status(400).json({success: false, message: "Oooops! De momento ainda não existem contas."})
            }
            const entitiesResults = allEntities.map(entities =>({
                id_entidade: entities.id_entidade,
                NIF_entidade: entities.NIF_entidade,
                firma_entidade: entities.firma_entidade,
                tipo_entidade: entities.tipo_entidade,
                contacto: entities.contacto_entidade[0].contacto,
                logradouro: entities.endereco_entidade[0].logradouro,
                rua: entities.endereco_entidade[0].rua,
                numero: entities.endereco_entidade[0].numero,
                cidade: entities.endereco_entidade[0].cidade,
                pais: entities.endereco_entidade[0].pais,
                latitude: entities.geolocalizacao_entidade[0].latitude,
                longitude: entities.geolocalizacao_entidade[0].longitude,
                createdAt: dayjs(entities.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                updatedAt: dayjs(entities.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
                id_conta_fk: entities.id_conta_fk,
            }))
            return res.status(200).json({success: true, response: entitiesResults})
        } catch (error: any)
        {
            console.error("Houve um erro: ", error.message)
            return res.status(500).json({success: false, message: "Estamos tentando resolver este problema, tente novamente"})    
        }
    }

    static async DeleteAllAccountsEntities(req: Request, res: Response): Promise<Response>
    {
        try
        {
            const allEntities = await prisma.entidades.findMany()
            console.log(allEntities)
            if (!allEntities || allEntities === null)
            {
                return res.status(400).json({success: false, message: "Oooops! De momento ainda não existem contas."})
            }
            const result = await prisma.entidades.deleteMany()
            if (!result)
            {
                return res.status(400).json({success: false, message: "Ocorreu um erro, tente novamente"})    
            }
            return res.status(200).json({success: false, message:"Usúarios deletados com sucesso!"})
        } catch (error) {
            console.error("Houve um erro: ", error)
            return res.status(500).json({success: false, message: "Estamos tentando resolver este problema, tente novamente"})    
        }
    }
}
export {UsersMagementController}