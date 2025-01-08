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
      validator.isEmail(email)
    }
    static async AdminExists(id_admin: string)
    {
      const verify = await prisma.admin.findUnique({where: {id_admin: id_admin}})
      return verify
    }
    static async MedicineExists(id_medicine: string)
    {
      const verify = await prisma.medicamentos.findFirst({where:{id_medicamento: id_medicine}})
      return verify
    }

    static sanitizeInput(username: string, email: string, password: string, nivel_acesso:string)
    {
      let InputSanitazed = {
        username_sanitized: validator.escape(validator.trim(username)),
        nivel_acesso_sanitized: validator.escape(validator.trim(nivel_acesso)),
        email_sanitized: validator.normalizeEmail(email),
        password_sanitized: validator.escape(validator.trim(password))
      }
      return InputSanitazed
    }
      
}