import { Request, Response } from "express" 
import { PrismaClient } from "@prisma/client" 
import { AccountRepository } from "../../../Repositories/AccountRepository/AccountRespository" 
import { AdminRepository } from "../../../Repositories/AdminRepository/AdminRepository" 
import { ValidatorProps } from '../../../Utils/Validators/validators/validators' 

// Inicialização do cliente Prisma para interação com o banco de dados
const Prisma = new PrismaClient() 
// Instâncias dos repositórios para interação com as tabelas de Admin e Account
const AdminRepositoryInstance = new AdminRepository(Prisma) 
const AccountRepositoryInstance = new AccountRepository(Prisma) 

export class DeleteAdminController {
  /**
   * Método para deletar um administrador e sua conta associada.
   * @param req - Objeto de requisição do Express.
   * @param res - Objeto de resposta do Express.
   * @returns Resposta JSON com o resultado da operação.
   */
  static async DeleteAdmin(req: Request, res: Response) {
    try {
      // Extração do ID do administrador a ser deletado a partir dos parâmetros da requisição
      const { id_admin } = req.params 

      // Verificação se o ID do administrador foi fornecido
      if (!id_admin) {
        return res.status(400).json({
          success: false,
          message: "Estamos tentando resolver este problema, por favor tente novamente.",
        }) 
      }

      // Verificação se o administrador existe no banco de dados
      const AdminExists = await ValidatorProps.AdminExists(id_admin) 
      if (!AdminExists) {
        return res.status(404).json({
          success: false,
          message: "Ooooops! Não foi possível encontrar este usuário, por favor tente novamente.",
        }) 
      }

      // Início da transação no banco de dados
      await Prisma.$transaction(
        async () => {
          // Deleção do administrador
          await AdminRepositoryInstance.deleteAdmin(id_admin) 

          // Extração do ID da conta associada ao administrador
          const id_account = AdminExists.id_conta_fk 

          // Deleção da conta associada
          await AccountRepositoryInstance.deleteAccount(id_account) 
        },
        { timeout: 20000 } // Timeout de 5 segundos para a transação
      ) 

      // Resposta de sucesso após a deleção
      return res.status(200).json({
        success: true,
        message: "Dados deletados com sucesso",
      }) 
    } catch (error: any) {
      // Tratamento de erros inesperados
      console.error("Houve um erro: ", error.message) 
      return res.status(500).json({
        success: false,
        message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde.",
      }) 
    }
  }
}