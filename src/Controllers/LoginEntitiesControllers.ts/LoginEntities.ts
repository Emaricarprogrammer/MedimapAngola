import { Request, Response } from "express"
import { PrismaClient, Prisma } from '@prisma/client'
import { ValidatorProps } from '../../Utils/Validators/validators/validators'
import {PasswordService} from "../../Utils/PasswordService/passwordService"
import dotenv from "dotenv"
import { JwtOperation} from "../../Utils/configs/private/JwtOperations"
import jwt from "jsonwebtoken"
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
        let access_level: any

        const IsAdmin = await prisma.admin.findFirst({where:{id_conta_fk: AccountExists.id_conta}, include:{credenciais_admin: true}})
        if (IsAdmin)
        {
            access_level = IsAdmin.nivel_acesso === "admin"?"admin":"gestor"
            userInfo = {
                id: IsAdmin.id_admin,
                id_conta_fk: IsAdmin.id_conta_fk,
                nivel_acesso: IsAdmin.nivel_acesso
            } 
        }
        else
        {
            const IsEntity = await prisma.entidades.findFirst({where:{id_conta_fk: AccountExists.id_conta}, include:{credenciais_entidades:true}})
            if(!IsEntity)
            {
                return res.status(404).json({sucess: false, message: "Estamos com problemas em encontrar a sua conta, por favor verifique as suas crédenciais"})
            }
            access_level = IsEntity.tipo_entidade === "farmacia"?"farmacia":"deposito"
            userInfo =
            {
                id: IsEntity.id_entidade,
                id_conta_fk: IsEntity.id_conta_fk,
                tipo_entidade: IsEntity.tipo_entidade
            }
        }
        const accessToken = JwtOperation.generateToken({id_entidade: userInfo.id,id_conta: userInfo.id_conta_fk, access_level})
        const refreshToken = JwtOperation.generateRefreshToken({id_entidade: userInfo.id,id_conta: userInfo.id_conta_fk, access_level})
        const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            secure: process.env.NODE_ENV == "dev" ? false : true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const existingToken = await prisma.refreshTokens.findFirst({where:{id_conta_fk: AccountExists.id_conta}})
        if(existingToken)
        {
            await prisma.refreshTokens.delete({where:{id_refreshToken: existingToken.id_refreshToken}})
        }
       await prisma.refreshTokens.create({
            data:{
                token: refreshToken,
                id_conta_fk: AccountExists.id_conta,
                expiracao: expireDate,
                usado: false
            }
        })

        return res.status(200).json({success: true, logged: true, accessToken: accessToken})
    }
    catch(error: any)
    {
        console.error("Houve um erro: ", error.message)
        return res.status(500).json({ success: false, message:"Estamos tentando resolver este problema por favor, tente novamente mais tarde." })
    }
}

    static async Logout(req: Request, res: Response):Promise<Response>
    {
        try
        {
            const {refreshToken} = req.cookies

            if (!refreshToken)
            {
                return res.status(400).json({success: false, message: "Ocorreu um erro ao terminar esta sessão"})
            }

            res.clearCookie("refreshToken",{
                httpOnly: true,
                secure: process.env.NODE_ENV == "dev" ? false : true,
                 sameSite: "lax"
            })
            return res.status(200).json({success: true, message: "Sessão terminada com sucesso!"})
        } catch (error: any)
        {
            console.error("Houve um erro: ", error.message)
            return res.status(500).json({ success: false, message:"Estamos tentando resolver este problema por favor, tente novamente mais tarde." })    
        }
    }
}