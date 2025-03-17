import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { ValidatorProps } from "../../Utils/Validators/validators/validators";
import { AccountRepository } from "../../Repositories/AccountRepository/AccountRespository";
import { EntitiesRepositories } from "../../Repositories/EntityRepository/EntityRepository";
import { ContactsRepository } from '../../Repositories/ContactsRepository/ContactsRepository';
import { AdressRepositories } from '../../Repositories/AdressRepository/AdressRepository';
import { GeolocationRepository } from '../../Repositories/GeolocationRepository/GeolocationRepository';


const prisma:PrismaClient = new PrismaClient()
const AccountRepositoryInstance: AccountRepository = new AccountRepository(prisma)
const EntitiesRepositoryInstance: EntitiesRepositories = new EntitiesRepositories(prisma)
const ContactsRepositoryInstance: ContactsRepository = new ContactsRepository(prisma)
const AdressRepositoryInstance: AdressRepositories = new AdressRepositories(prisma)
const GeolocationRepositoryInstance: GeolocationRepository = new GeolocationRepository(prisma)
export default class DeleteEntityController
{
    static async deleteEntity(req: Request, res: Response): Promise<Response>
    {
        try {
            const {id_entidade} = req.params
            if (!id_entidade)
            {
                console.log("Id invalido")
                return res.status(400).json({success: false, message: "Estamos tentando resolver este problema, por favor tente novamente."})
            }

            const EntityExists = await ValidatorProps.EntityExists(id_entidade)
            if (!EntityExists)
            {
                console.log("Usuário não encontrado")
                return res.status(404).json({success: false, message: "Ooooops! Não foi possivel encontrar este usuário, por favor tente novamente."})
            }

            await prisma.$transaction(async(tx)=>{
                await EntitiesRepositoryInstance.deleteEntity(id_entidade)
                await AccountRepositoryInstance.deleteAccount(EntityExists.id_conta_fk)
                await ContactsRepositoryInstance.deleteContact(id_entidade)
                await AdressRepositoryInstance.deleteAdress(id_entidade)
                await GeolocationRepositoryInstance.deleteGeolocation(id_entidade)
            },{timeout:5000})
            return res.status(200).json({success: true, message:"Dados deletados com sucesso"})

        } catch (error) {
            console.error(error) 
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." }) 
        }
    }
}