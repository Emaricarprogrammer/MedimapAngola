import { Request, Response } from "express"
import { AdminRepository } from "../../Repositories/AdminRepository/AdminRepository"
import { PrismaClient, Prisma } from '@prisma/client'
import { AccountRepository } from '../../Repositories/AccountRepository/AccountRespository'
import { ValidatorProps } from '../../Utils/Validators/validators/validators'
import { EmailSender } from '../../Utils/providers/SendEmails/SendEmail'
import dotenv from "dotenv"

dotenv.config()
const prisma = new PrismaClient()
const AdminRepositoryInstance = new AdminRepository(prisma)
const AccountRepositoryInstance = new AccountRepository(prisma)

export default class CreateAccountAdminController
{
  async CreateAdminAccount(req: Request, res: Response): Promise<Response>
  {
    try {
      let { username,email,password,nivel_acesso} = req.body

      const { username_sanitized, nivel_acesso_sanitized, email_sanitized, password_sanitized } =
      ValidatorProps.sanitizeInput(username, email, password, nivel_acesso);
  
      if (!username_sanitized || !nivel_acesso_sanitized || !email_sanitized || !password_sanitized) {
        return res.status(400).json({ success: false, message: "Por favor, verifique se preencheu todos os campos" })
      }
  
      if (!["admin", "gestor"].includes(nivel_acesso.toLowerCase())) {
        return res.status(400).json({ success: false, message: "Ooooops! Parece que seu nivel de acesso está incorrecto" })
      }
  
      if (!ValidatorProps.IsVAlidEmail) {
        return res.status(400).json({ success: false, message:"Oooooops! Este formato de email é inválido."})
      }
  
      const EmailExists = await ValidatorProps.EmailExists(email_sanitized)
      if (EmailExists)
      {
        return res.status(400).json({ success: false, message: "Oooooops! Este email já está sendo usado, tente usar outro." })
      }
        if (ValidatorProps.validatePassword(password_sanitized) == false)
        {
          return res.status(400).json({ success: false, message: "A sua senha deve ter pelo menos 8 caracteres, conter uma letra maiúscula, um número e um caractere especial." })
        }
      
      const AccountCreated = await AccountRepositoryInstance.createAccount({ email:email_sanitized, password:password_sanitized })
      if (!AccountCreated || !AccountCreated.id_conta)
      {
        return res.status(400).json({ success: false, message:"Estamos tentando resolver este problema, por favor tente novamente." })
      }

      const AdminDatas = { username:username_sanitized, nivel_acesso, id_conta_fk: AccountCreated.id_conta }
      const AdminCreated = await AdminRepositoryInstance.createAdmin(AdminDatas)

      if (!AdminCreated)
      {
        console.log("Nao foi possivel criar este admin")
        return res.status(500).json({ success: false, message:"Estamos tentando resolver este problema, por favor tente novamente."})
      }
      const AdminCreatedResponse =
      {
        id_admin: AdminCreated.id_admin,
        username: AdminCreated.username,
        email: AccountCreated.email,
        nivel_acesso: AdminCreated.nivel_acesso,
        id_conta_fk: AdminCreated.id_conta_fk,
        createdAt: AdminCreated.createdAt
      }

      const sendEmailInstance = new EmailSender({
        text: "A equipa da MediMapAngola da-lhe as boas vindas",
        subject: "Welcome",
        from: "noreplaymedimapangola@gmail.com",
        to: email,
        html: process.env.HTML
      })
      sendEmailInstance.SendEmail().then((result) => {console.log("Email enviado com sucesso")})
      .catch((err) => {console.log("Erro ao enviar email")})

      return res.status(201).json({success: true, message:"Usário com sucesso",response: AdminCreatedResponse})
    } catch (error: any)
    {
      console.error("Houve um erro: ", error)
      return res.status(500).json({ success: false, message:"Estamos tentando resolver este problema, por favor tente novamente." })
    }
  }
  }
