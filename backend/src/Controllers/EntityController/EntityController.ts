import { Request, Response } from 'express';
import { EntityRepository } from '../../Repositories/EntityRepository/EntityRepository';
import { PrismaClient } from '@prisma/client';


const Prisma = new PrismaClient();
const EntityRepositoryInstance = new EntityRepository(Prisma);


export default class EntityController {
    async CreateEntityAccount(req: Request, res: Response)
    {
        try
        {

            const newEntity = await EntityRepositoryInstance.createEntity(req)

            return res.status(201).json({success: true, message: "Entidade criada com sucesso", response: newEntity });

        } 
        catch (error)
        {
            if (error instanceof Error)
            {
                console.error(error.message)
                return res.status(400).json({
                    message: error.message
                })
            }
            return res.status(500).json({
                message: 'Erro ao criar entidde',
                error: error
            })
        }
    }
   
    async FindEntity(req:Request, res:Response)
    {
        try {
            
            const results = await EntityRepositoryInstance.findEntity(req)
            return res.status(200).json({success: true,response: results})
            
        } catch (error) {
            if(error instanceof Error)
            {
                return res.status(400).json({message:error.message})
            }
            return res.status(500).json({message:error})
        }
    }
    async UpdateEntity(req:Request, res:Response)
    {
        try {
            
            const results = await EntityRepositoryInstance.updateEntity(req)
            return res.status(200).json({success: true,message:"Dados actualizados com sucesso!",response:results})
        } catch (error) {
            if(error instanceof Error)
            {
                return res.status(400).json({message: error.message})
            }
            console.error(error)
            return res.status(500).json({message: error})
        }
    }
    async DeleteEntity(req:Request, res:Response){
        try {
           

            const results = await EntityRepositoryInstance.deleteEntity(req)
            return res.status(200).json({success: true, message: "Entidade eliminada com sucesso!"})
        } catch (error) {
            if(error instanceof Error)
            {
                return res.status(400).json({message: error.message})
            }
            console.error(error)
            return res.status(500).json({message: error})
        }
    }
}