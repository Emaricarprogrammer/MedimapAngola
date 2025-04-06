import { Request, Response } from "express" 
import { PrismaClient } from "@prisma/client" 
import { AdminRepository } from "../../../Repositories/AdminRepository/AdminRepository" 
import { AccountRepository } from "../../../Repositories/AccountRepository/AccountRespository" 
import { ValidatorProps } from "../../../Utils/Validators/validators/validators" 
import { Emailsent } from "../../../Utils/providers/SendEmails/SendEmail" 
import dotenv from "dotenv" 
import fs from "fs" 
import path from "path" 
import dayjs from "dayjs"

// Configuração do caminho para o arquivo HTML de template de e-mail
const htmlpath = path.join(__dirname, "../../../Utils/providers/SendEmails/Templates/Welcome.html") 
// Leitura do conteúdo do arquivo HTML
const HTML = fs.readFileSync(htmlpath, "utf-8") 

// Carregamento das variáveis de ambiente
dotenv.config() 
// Inicialização do cliente Prisma para interação com o banco de dados
const prisma = new PrismaClient() 

export default class CreateAccountAdminController {
  /**
   * Método para criar uma conta de administrador.
   * @param req - Objeto de requisição do Express.
   * @param res - Objeto de resposta do Express.
   * @returns Resposta JSON com o resultado da operação.
   */
  static async CreateAdminAccount(req: Request, res: Response): Promise<Response> {
    try {
      // Extração dos dados do corpo da requisição
      let { username, email, password, nivel_acesso } = req.body 

      // Sanitização dos dados de entrada para evitar problemas de segurança
      const {
        username_sanitized,
        nivel_acesso_sanitized,
        email_sanitized,
        password_sanitized,
      } = ValidatorProps.sanitizeInput(
        username,
        email,
        password,
        nivel_acesso
      ) 

      // Validação dos campos obrigatórios
      if (
        !username_sanitized ||
        !nivel_acesso_sanitized ||
        !email_sanitized ||
        !password_sanitized
      ) {
        return res.status(400).json({
          success: false,
          message: "Por favor, verifique se preencheu todos os campos.",
        }) 
      }

      // Validação do nível de acesso (deve ser "admin" ou "gestor")
      if (!["admin"].includes(nivel_acesso))
      {
        return res.status(400).json({
          success: false,
          message: "Ooooops! Parece que seu nível de acesso está incorreto.",
        }) 
      }

      // Validação do formato do e-mail
      if (!ValidatorProps.IsVAlidEmail(email_sanitized)) {
        return res.status(400).json({
          success: false,
          message: "Oooooops! Este formato de email é inválido.",
        }) 
      }

      // Verificação se o e-mail já está em uso
      const EmailExists = await ValidatorProps.EmailExists(email_sanitized) 
      if (EmailExists) {
        return res.status(400).json({
          success: false,
          message: "Oooooops! Este email já está sendo usado, tente usar outro.",
        }) 
      }

      // Validação da senha (deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial)
      if (ValidatorProps.validatePassword(password_sanitized) == false) {
        return res.status(400).json({
          success: false,
          message:
            "A senha deve ter pelo menos 8 caracteres, conter uma letra maiúscula, um número e um caractere especial.",
        }) 
      }

      // Início da transação no banco de dados
      const result = await prisma.$transaction(async (tx) => {
        // Instâncias dos repositórios para interação com o banco de dados
        const AdminRepositoryInstance = new AdminRepository(prisma) 
        const AccountRepositoryInstance = new AccountRepository(prisma) 

        // Criação da conta no banco de dados
        const AccountCreated = await AccountRepositoryInstance.createAccount({
          email: email_sanitized,
          password: password_sanitized,
        }, tx) 

        // Verificação se a conta foi criada com sucesso
        if (!AccountCreated || !AccountCreated.id_conta) {
          return res.status(400).json({
            success: false,
            message: "Estamos tentando resolver este problema, por favor tente novamente.",
          }) 
        }

        // Dados do administrador a serem criados
        const AdminDatas = {
          username: username_sanitized,
          nivel_acesso,
          id_conta_fk: AccountCreated.id_conta,
        } 

        // Criação do administrador no banco de dados
        const AdminCreated = await AdminRepositoryInstance.createAdmin(
          AdminDatas, tx
        ) 

        // Verificação se o administrador foi criado com sucesso
        if (!AdminCreated) {
          return res.status(500).json({
            success: false,
            message: "Estamos tentando resolver este problema, por favor tente novamente.",
          }) 
        }

        // Resposta com os dados do administrador criado
        const AdminCreatedResponse = {
          id_admin: AdminCreated.id_admin,
          username: AdminCreated.username,
          email: AccountCreated.email,
          nivel_acesso: AdminCreated.nivel_acesso,
          id_conta_fk: AdminCreated.id_conta_fk,
          createdAt: dayjs(AdminCreated.createdAt).format("YYYY-MM-DD HH:mm:ss"),
          updatedAt: dayjs(AdminCreated.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
        } 

        return AdminCreatedResponse 
      }, { timeout: 10000 }) 

      // Envio de e-mail de boas-vindas para o novo administrador
      await Emailsent(email_sanitized, HTML) 

      // Resposta final após todas as operações bem-sucedidas
      return res.status(201).json({
        success: true,
        message: "Usuário criado com sucesso!",
        response: result,
      }) 
    } catch (error: any) {
      // Tratamento de erros inesperados
      console.error("Houve um erro: ", error.message) 
      return res.status(500).json({
        success: false,
        message: "Estamos tentando resolver este problema por favor, tente novamente mais tardesss.",
      }) 
    }
  }
}