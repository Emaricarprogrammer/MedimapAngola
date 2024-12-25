import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AccountRepository } from "../../Repositories/AccountRepository/AccountRespository";
import { AdminRepository } from "../../Repositories/AdminRepository/AdminRepository";
import { ValidatorProps } from '../../Utils/Validators/validators/validators';

const Prisma = new PrismaClient();
const AdminRepositoryInstance = new AdminRepository(Prisma);
const AccountRepositoryInstance = new AccountRepository(Prisma);

export class DeleteAdmin
{
    async DeleteAdminController(req: Request, res: Response)
    {
        try {
            const {id_admin} = req.params
            if (!id_admin)
            {
                console.log("Id invalido")
                return res.status(400).json({success: false, message: "Estamos tentando resolver este problema, por favor tente novamente."})
            }

            const AdminExists = await ValidatorProps.AdminExists(id_admin)
            if (!AdminExists)
            {
                console.log("Usuário não encontrado")
                return res.status(404).json({success: false, message: "Ooooops! Não foi possivel encontrar este usuário, por favor tente novamente."})
            }
                await Prisma.$transaction(async () => {
                await AdminRepositoryInstance.deleteAdmin(id_admin)
                const id_account = AdminExists.id_conta_fk
                await AccountRepositoryInstance.deleteAccount(id_account)
              });

            return res.status(200).json({success: true, message:"Dados deletados com sucesso"})
        } catch (error) {
            console.error("Houve um erro: ", error)
            return res.status(500).json({success: false, message:"Estamos tentando resolver este problema, por favor tente novamente."})
        }
    }
}