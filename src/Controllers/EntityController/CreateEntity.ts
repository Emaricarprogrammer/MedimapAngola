import { Request, Response } from "express" 
import { EntitiesRepositories } from "../../Repositories/EntityRepository/EntityRepository" 
import { PrismaClient } from "@prisma/client" 
import { ValidatorProps } from "../../Utils/Validators/validators/validators" 
import { AccountRepository } from "../../Repositories/AccountRepository/AccountRespository" 
import { Emailsent } from "../../Utils/providers/SendEmails/SendEmail" 
import dotenv from "dotenv" 
import { ContactsRepository } from '../../Repositories/ContactsRepository/ContactsRepository' 
import { AdressRepositories } from '../../Repositories/AdressRepository/AdressRepository' 
import { GeolocationRepository } from '../../Repositories/GeolocationRepository/GeolocationRepository' 
import validator from "validator" 
import fs from "fs" 
import path from "path" 
import dayjs from "dayjs" 
import { JwtOperation } from "../../Utils/configs/private/JwtOperations" 

dotenv.config() 

const prisma: PrismaClient = new PrismaClient() 
const htmlpath = path.join(__dirname, "../../Utils/providers/SendEmails/Templates/Welcome.html") 
const HTML = fs.readFileSync(htmlpath, "utf-8") 

export class CreateEntityController {
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      // Extrai os dados do corpo da requisição (compatível com ou sem newEntity)
      const requestData = req.body.newEntity || req.body 
      
      const { 
        nif,
        firma,
        tipo_entidade,
        contacto,
        email,
        password,
        logradouro,
        rua,
        numero,
        cidade,
        latitude,
        longitude
      } = requestData 

      // Lista de campos obrigatórios
      const camposObrigatorios = [
        "nif", "firma", "tipo_entidade", "contacto", "email", "password",
        "logradouro", "rua", "numero", "cidade", "latitude", "longitude"
      ] 

      // Verifica campos faltantes
      const camposFaltantes = camposObrigatorios.filter(campo => !requestData[campo]) 

      if (camposFaltantes.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Por favor, preencha todos os campos obrigatórios",
          camposFaltantes: camposFaltantes
        }) 
      }

      // Validação do tipo de entidade
      if (!tipo_entidade || !["farmacia", "deposito"].includes(tipo_entidade.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Apenas aceitamos Fármacias e Depósitos.",
        }) 
      }

      // Validação do formato do email
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "O formato de email é inválido.",
        }) 
      }

      // Validação do NIF
      const nifExists = await ValidatorProps.NifExists(nif) 
      if (nifExists) {
        return res.status(400).json({
          success: false,
          message: "Este NIF já está sendo usado, tente usar outro.",
        }) 
      }

      if (nif.length !== 10) {
        return res.status(400).json({
          success: false,
          message: "O NIF deve conter exatamente 10 dígitos.",
        }) 
      }

      // Verificação se o email já existe
      const emailExists = await ValidatorProps.EmailExists(email) 
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Este email já está sendo usado, tente usar outro.",
        }) 
      }

      // Verificação se o número já existe
      if (await ValidatorProps.NumberExists(contacto)) {
        return res.status(400).json({
          success: false,
          message: "Este número já está sendo usado, tente usar outro.",
        }) 
      }

      // Validação da senha
      if (ValidatorProps.validatePassword(password) == false) {
        return res.status(400).json({
          success: false,
          message: "A senha deve ter pelo menos 8 caracteres, conter uma letra maiúscula, um número e um caractere especial.",
        }) 
      }

      // Sanitização dos dados de entrada
      const sanitizedData = ValidatorProps.EntityInputs(requestData) 

      // Transação no Prisma para criar conta e entidade
      const result = await prisma.$transaction(async (tx) => {
        const EntitiesRepositoriesInstance = new EntitiesRepositories(prisma) 
        const ContactsRepositoriesInstance = new ContactsRepository(prisma) 
        const AdressRepositoriesInstance = new AdressRepositories(prisma) 
        const GeolocationRepositoryInstance = new GeolocationRepository(prisma) 
        
        // Criação da conta
        const AccountRepositoryInstance = new AccountRepository(prisma) 
        const accountCreated = await AccountRepositoryInstance.createAccount(
          { email, password },
          tx
        ) 

        if (!accountCreated?.id_conta) {
          throw new Error("Falha ao criar conta") 
        }

        // Criação da entidade
        const createdEntity = await EntitiesRepositoriesInstance.createEntity(
          {
            NIF_entidade: nif,
            firma_entidade: sanitizedData.firma,
            tipo_entidade: tipo_entidade,
            id_conta_fk: accountCreated.id_conta,
          },
          tx
        ) 

        if (!createdEntity?.id_entidade) {
          throw new Error("Falha ao criar entidade") 
        }
        
        // Criação do contato
        const contactCreated = await ContactsRepositoriesInstance.createContacts(
          {
            contacto: contacto,
            id_entidade_fk: createdEntity.id_entidade
          },
          tx
        ) 

        if (!contactCreated) {
          throw new Error("Falha ao criar contato") 
        }

        // Criação do endereço
        const adressCreated = await AdressRepositoriesInstance.createAdress(
          {
            logradouro: sanitizedData.logradouro,
            rua: sanitizedData.rua,
            cidade: sanitizedData.cidade,
            numero: numero,
            pais: "Angola",
            id_entidade_fk: createdEntity.id_entidade
          },
          tx
        ) 

        // Criação da geolocalização
        const geolocationCreated = await GeolocationRepositoryInstance.createGeolocation({
          latitude: latitude,
          longitude: longitude,
          id_entidade_fk: createdEntity.id_entidade
        }, tx) 

        const accessToken = await JwtOperation.generateToken({
          id_entidade: createdEntity.id_entidade,
          id_conta: accountCreated.id_conta,
          access_level: createdEntity.tipo_entidade 
        })
        res.cookie("acessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV == "dev" ? false : true,
          sameSite: "lax",
          maxAge: 15*60*1000

      })
        // Dados para retorno
        return {
          id_entidade: createdEntity.id_entidade,
          NIF_entidade: createdEntity.NIF_entidade,
          firma_entidade: createdEntity.firma_entidade,
          tipo_entidade: createdEntity.tipo_entidade,
          email: accountCreated.email,
          contacto: contactCreated.contacto,
          logradouro: adressCreated.logradouro,
          rua: adressCreated.rua,
          numero: adressCreated.numero,
          cidade: adressCreated.cidade,
          pais: adressCreated.pais,
          latitude: geolocationCreated.latitude,
          longitude: geolocationCreated.longitude,
          createdAt: dayjs(createdEntity.createdAt).format("DD-MM-YY: HH:mm:ss"),
          id_conta_fk: accountCreated.id_conta
        } 
      }, { timeout: 20000 }) 

      // Envio de email de boas-vindas
      await Emailsent(email, HTML) 

      // Resposta de sucesso
      console.log(result)
      return res.status(201).json({
        success: true,
        message: `conta ${tipo_entidade} criada com sucesso!`,
        response: result,
      }) 
    } catch (error) {
      console.error("Erro ao criar entidade:", error) 
      return res.status(500).json({
        success: false,
        message: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.",
      }) 
    }
  }
}