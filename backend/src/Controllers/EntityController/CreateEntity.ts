import { Request, Response } from "express";
import { EntitiesRepositories } from "../../Repositories/EntityRepository/EntityRepository";
import { PrismaClient } from "@prisma/client";
import { ValidatorProps } from "../../Utils/Validators/validators/validators";
import { AccountRepository } from "../../Repositories/AccountRepository/AccountRespository";
import {  Emailsent } from "../../Utils/providers/SendEmails/SendEmail";
import dotenv from "dotenv"
import { ContactsRepository } from '../../Repositories/ContactsRepository/ContactsRepository';
import { AdressRepositories } from '../../Repositories/AdressRepository/AdressRepository';
import { GeolocationRepository } from '../../Repositories/GeolocationRepository/GeolocationRepository';
import validator from "validator"
dotenv.config()
// Instância do Prisma
const prisma: PrismaClient = new PrismaClient();

export class CreateEntityController {
  static async create(req: Request, res: Response): Promise<Response> {
    try {
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
        pais,
        latitude,
        longitude
      } = req.body;
      const fields = [
        "nif",
        "firma",
        "tipo_entidade",
        "contacto",
        "email",
        "password",
        "logradouro",
        "rua",
        "numero",
        "cidade",
        "pais",
        "latitude",
        "longitude"
      ].filter((field) => !req.body[field]);
      

      if (fields.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Por favor, verifique se preencheu todos os campos",
        });
      }

      // Validação do tipo de entidade
      if (!["farmacia", "deposito"].includes(tipo_entidade.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Apenas aceitamos Fármacias e Depósitos.",
        });
      }

      // Validação do formato do email
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Oooooops! Este formato de email é inválido.",
        });
      }

      const nifExists = await ValidatorProps.NifExists(nif)
      if (nifExists)
        {
          
          return res.status(400).json({
              success: false,
              message: "Oooooops! Este NIF já está sendo usado, tente usar outro.",
            });
        }

        if (nif.length > 10)
        {
                    
          return res.status(400).json({
            success: false,
            message: "Oooooops! Por favor, o seu NIF deve conter apenas 10 digitos.",
          });
        }
      // Verificação se o email já existe
      const emailExists = await ValidatorProps.EmailExists(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Oooooops! Este email já está sendo usado, tente usar outro.",
        });
      }
      if (await ValidatorProps.NumberExists(contacto))
      {
        return res.status(400).json({
            success: false,
            message: "Oooooops! Este número já está sendo usado, tente usar outro.",
          });
      }
      // Validação da senha
      if (ValidatorProps.validatePassword(password) == false) {
        return res.status(400).json({
          success: false,
          message:
            "A senha deve ter pelo menos 8 caracteres, conter uma letra maiúscula, um número e um caractere especial.",
        });
      }

      // Sanitização dos dados de entrada
      const sanitizedData = ValidatorProps.EntityInputs(req.body);

      // Transação no Prisma para criar conta e entidade
      const result = await prisma.$transaction(async (tx) => {

        const EntitiesRepositoriesInstance: EntitiesRepositories = new EntitiesRepositories(prisma)
        const ContactsRepositoriesInstance: ContactsRepository = new ContactsRepository(prisma)
        const AdressRepositoriesInstance: AdressRepositories = new AdressRepositories(prisma)
        const GeolocationRepositoryInstance: GeolocationRepository = new GeolocationRepository(prisma)
        // Criação da conta
        const AccountRepositoryInstance = new AccountRepository(prisma);
        const accountCreated = await AccountRepositoryInstance.createAccount(
          { email, password },
        tx
        );

        if (!accountCreated || !accountCreated.id_conta) {
          return res.status(400).json({success: false, message:"Estamos tentando resolver este problema, por favor tente novamente."})
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
        );

        if (!createdEntity || !createdEntity.id_entidade) {
          return res.status(400).json({success: false, message:"Estamos tentando resolver este problema, por favor tente novamente."})
        }
        
        const contactCreated = await ContactsRepositoriesInstance.createContacts(
            {
                contacto: contacto,
                id_entidade_fk: createdEntity.id_entidade
            },
            tx
        )

        if (!contactCreated)
        {
            return res.status(400).json({success: false, message:"Estamos tentando resolver este problema, por favor tente novamente."})

        }
        const adressCreated = await AdressRepositoriesInstance.createAdress(
          {
            logradouro: sanitizedData.logradouro,
            rua: sanitizedData.rua,
            cidade: sanitizedData.cidade,
            numero:numero,
            pais: sanitizedData.pais,
            id_entidade_fk: createdEntity.id_entidade
          },
          tx
        )
        const geolocationCreated = await GeolocationRepositoryInstance.createGeolocation({
          latitude: latitude,
          longitude: longitude,
          id_entidade_fk: createdEntity.id_entidade
        },
      tx)
        const Datas = {
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
            createdAt: createdEntity.createdAt,
            id_conta_fk: accountCreated.id_conta
          }
            return Datas
      },{timeout:10000});

      await Emailsent(email)

      // Resposta de sucesso
      return res.status(201).json({
        success: true,
        message: "Usuário criado com sucesso!",
        response: result,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Estamos tentando resolver este problema, por favor tente novamente.",
      });
    }
  }
}
/**
 * TypeError: Cannot read properties of null (reading 'id_contacto')
    at C:\MedimapAngola\Projecto-final\backend\src\dist\Controllers\EntityController\UpdateEntity.js:95:109
    at async Proxy._transactionWithCallback (C:\MedimapAngola\Projecto-final\backend\src\node_modules\@prisma\client\runtime\library.js:130:7984)
    at async UpdateEntityController.updateEntity (C:\MedimapAngola\Projecto-final\backend\src\dist\Controllers\EntityController\UpdateEntity.js:78:28)

 */