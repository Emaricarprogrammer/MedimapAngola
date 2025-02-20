import { Request, Response } from "express"
import { AdminRepository } from "../../Repositories/AdminRepository/AdminRepository"
import { PrismaClient, Prisma } from '@prisma/client'
import { AccountRepository } from '../../Repositories/AccountRepository/AccountRespository'
import { ValidatorProps } from '../../Utils/Validators/validators/validators'
import {PasswordService} from "../../Utils/PasswordService/passwordService"
import JWT from "jsonwebtoken"
import dotenv from "dotenv"


dotenv.config()
const prisma = new PrismaClient()
export class LoginEntity
{
    static async  LoginEntities(req: Request, res: Response): Promise<Response>
{
    try
    {
        const {email,password} = req.body

        if (!email || !password)
        {
            return res.status(400).json({success: false, message: "Por favor, verifique se preencheu todos os campos"})
        }
        const AccountExists = await ValidatorProps.EmailExists(email)
        if(!AccountExists)
        {
            return res.status(401).json({success: false, message: "Email ou senha inválidos"})
        }

        const isValidPassword = await PasswordService.PasswordCompare(password, AccountExists.password);

        if (!isValidPassword)
        {
            return res.status(401).json({success: false, message: "Email ou senha inválido"})
        }
        let userInfo: any
        let role: any

        const IsAdmin = await prisma.admin.findFirst({where:{id_conta_fk: AccountExists.id_conta}})
        if (IsAdmin)
        {
            role = IsAdmin.nivel_acesso === "admin"?"admin":"gestor"
            userInfo = {
                id: IsAdmin.id_admin,
                username_admin: IsAdmin.username,
                nivel_acesso: IsAdmin.nivel_acesso
            }
        }
        else 
        {
            const IsEntity = await prisma.entidades.findFirst({where:{id_conta_fk: AccountExists.id_conta}})
            if(!IsEntity)
            {
                return res.status(404).json({sucess: false, message: "Estamos com problemas em encontrar a sua conta, por favor verifique as suas crédenciais"})
            }
            role = IsEntity.tipo_entidade === "farmacia"?"farmacia":"deposito"
            userInfo =
            {
                id: IsEntity.id_entidade,
                firma_entidade: IsEntity.firma_entidade,
                tipo_entidade: IsEntity.tipo_entidade
            }
            
        }

        const token = JWT.sign({id_entidade: userInfo.id, role, ...userInfo}, process.env.SUPER_SECRET_KEY!)
        return res.status(200).json({logged: true, token, response:userInfo})
    }
    catch(error: any)
    {
        console.error("Houve um erro: ", error.message)
        return res.status(500).json({ success: false, message:"Estamos tentando resolver este problema por favor, tente novamente mais tarde." })
    }
}
}
