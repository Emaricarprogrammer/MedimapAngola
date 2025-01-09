import { Request, Response } from "express";
import { AdminRepository } from "../../../Repositories/AdminRepository/AdminRepository";
import { PrismaClient } from "@prisma/client";
import { AccountRepository } from '../../../Repositories/AccountRepository/AccountRespository';
import { ValidatorProps } from '../../../Utils/Validators/validators/validators';
import validator from "validator"
import { PasswordService } from "../../../Utils/PasswordService/passwordService";

const Prisma = new PrismaClient();
const AdminRepositoryInstance = new AdminRepository(Prisma);
const AccountRepositoryInstance = new AccountRepository(Prisma);

export class UpdateAdminAccountController
{
    static async updateAdminAccount(req: Request, res: Response)
    {
        try
        {
          const { id_admin } = req.params;
          const { username, nivel_acesso, email, password } = req.body;
  
          if (!id_admin) {
            console.log("ID inválido");
            return res.status(400).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
          }

          const AdminExits = await ValidatorProps.AdminExists(id_admin);
          if (!AdminExits)
          {
            console.log("Usuário não encontrado");
            return res.status(404).json({ success: false, message:"Oooooops! Não conseguimos encontrar este usário, por favor tente novamente." });
          }
  
          const AdminUpdateData: Partial<{ username: string; nivel_acesso: string }> = {};
          const AccountUpdateData: Partial<{ email: string; password: string }> = {};
    
          if (username)
          {
            AdminUpdateData.username = validator.escape(validator.trim(username));
          }
    
          if (nivel_acesso)
          {
            if (!["admin", "gestor"].includes(nivel_acesso.toLowerCase()))
            {
              return res.status(400).json({ success: false, message:"Ooooops! Parece que seu nivel de acesso está incorrecto." });
            }
            AdminUpdateData.nivel_acesso = nivel_acesso.toLowerCase();
          }
    
          if (email)
          {
            if (!validator.isEmail(email))
            {
              return res.status(400).json({ success: false, message: "Oooooops! Este formato de email é inválido." });
            }
            const EmailExists = await ValidatorProps.EmailExists(email);
            if (EmailExists)
            {
              return res.status(400).json({ success: false, message:"Oooooops! Este email já está sendo usado, tente usar outro." });
            }
            AccountUpdateData.email = email;
          }
    
          if (password)
          {
            const HashedPassword = await PasswordService.hashPassword(password);
            AccountUpdateData.password = HashedPassword;
          }

          else
          {
            return res.status(400).json({success: false, message:"Por favor, informe pelo menos um campo para actualização."})
          }

          if (Object.keys(AccountUpdateData).length > 0)
          {
            const AccountUpdated = await AccountRepositoryInstance.updateAccount(AdminExits.id_conta_fk, AccountUpdateData);
            if (!AccountUpdated)
            {
              return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
            }
          }
    
          if (Object.keys(AdminUpdateData).length > 0)
          {
            const AdminUpdated = await AdminRepositoryInstance.updateAdmin(id_admin, {username, nivel_acesso});
            if (!AdminUpdated)
            {
              return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
            }
          }
          return res.status(200).json({ success: true, message: "Actualizado com sucesso"});
        } catch (error)
        {
          console.error("Houve um erro:", error);
          return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
        }
      }
}