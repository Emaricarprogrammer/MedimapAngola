import { PrismaClient } from "@prisma/client"
import validator from "validator"
import { Request, response, Response } from "express"
const prisma = new PrismaClient()

export class ValidatorProps
{
    static validateEmail(email: string){
        if (!email)
        {
          return response.status(400).json({success: false, message: "Invalid email"})
        }
        if (!validator.isEmail(email))
        {
          return response.status(400).json({success: false, message: "Invalid email"})
        }
        return true
      }
      static async NumberExists(number: number)
      {
        const verify = await prisma.contactos.findFirst({where:{contacto: number}})
        return verify
      }
      static async passwordExists(password: string)
      {
        return await prisma.contas.findFirst({where:{password: password}})
      }
      static async LongitudeExists(long: number)
      {
        return await prisma.geolocalizacao.findFirst({where:{longitude: long}})
      }
      static async LatitudeExists(lat: number)
      {
        return await prisma.geolocalizacao.findFirst({where:{latitude: lat}})
      }
      static async NifExists(number: string)
      {
         const verify =  prisma.entidades.findFirst({where:{NIF_entidade: number}})
         return verify
      }
    static validatePassword(password: string){
        const RegexPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
        if (!RegexPassword.test(password)) {
          return false
        }
      }
    static async EmailExists(email: string){
      const verify = await prisma.contas.findUnique({where: {email: email}})
      return verify
    }
    static IsVAlidEmail(email: string)
    {
      if (validator.isEmail(email))
      {
        return true
      }
      false
    }
    static async AdminExists(id_admin: string)
    {
      const verify = await prisma.admin.findUnique({where: {id_admin: id_admin}})
      return verify
    }

    static async EntityExists(id_entity: string)
    {
      const verify = await prisma.entidades.findUnique({where: {id_entidade: id_entity}})
      return verify
    }
    static async MedicineExists(id_medicine: string)
    {
      const verify = await prisma.medicamentos.findFirst({where:{id_medicamento: id_medicine}})
      return verify
    }

    static sanitizeInput(username: string, email: string, password: string, nivel_acesso: string) {
      return {
        username_sanitized: validator.trim(validator.escape(username)), // Remove espaços extras
        nivel_acesso_sanitized: nivel_acesso, // Normaliza para evitar problemas
        email_sanitized: validator.normalizeEmail(email) || "", // Garante que seja um e-mail válido
        password_sanitized: password.trim() // Senhas não devem ser alteradas, apenas hashadas depois
      };
    }

    static MedicineInputsSanitized = (data: any) => {
      return {
        categoria_medicamento: validator.escape(data.categoria_medicamento.trim()),
        nome_generico: validator.escape(data.nome_generico.trim()),
        nome_comercial: validator.escape(data.nome_comercial.trim()),
        origem_medicamento: validator.escape(data.origem_medicamento.trim()),
        validade_medicamento: new Date(data.validade_medicamento),
        preco_medicamento: parseFloat(data.preco_medicamento),
        imagem_url: data.imagem_url,
        quantidade_disponivel: parseInt(validator.escape(data.quantidade_disponivel), 10)
      };
      
    }
    static EntityInputs = (data: any)=>{
      return {
        firma: validator.escape(validator.trim(data.firma)),
        tipo_entidade: validator.escape(validator.trim(data.tipo_entidade)),
        logradouro: validator.escape(validator.trim(data.logradouro)),
        rua: validator.escape(validator.trim(data.rua)),
        cidade: validator.escape(validator.trim(data.cidade)),
        pais:  validator.escape(validator.trim(data.cidade)),
    }
  }
  }