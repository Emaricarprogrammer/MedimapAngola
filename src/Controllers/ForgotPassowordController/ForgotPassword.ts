import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import crypto from "crypto"
import { EmailSender } from "../../Utils/providers/SendEmails/SendEmail";
import dotenv from "dotenv"
import { PasswordService } from '../../Utils/PasswordService/passwordService';
import { ValidatorProps } from "../../Utils/Validators/validators/validators";
import { ResetPasswordTemplate } from "../../Utils/providers/SendEmails/Templates/resetPasswordTemplate";
dotenv.config()

const prisma: PrismaClient = new PrismaClient()
export class ForgotPasswordController
{
    static async ForgotPassword(req: Request, res: Response):Promise<Response>
    {
        try {
            const {email} = req.body
            if (!email)
            {
                return res.status(400).json({success:false, message: "Por favor, verifique se preencheu todos os campos"})
            }
            const user = await prisma.contas.findUnique({where:{email:email}})
            if (!user)
            {
                return res.status(400).json({success:false, message: "Não conseguimos encontrar esta conta"})
            }
            const token = crypto.randomBytes(32).toString("hex")
            await prisma.recuperacao_senha.create({data:{token, expiracao: new Date(Date.now() + 3600000), id_conta_fk: user.id_conta, usado:false}})
            const EmailSent = new EmailSender({
                text: "Recuperação de Senha.",
                subject: "Recuperação de Senha",
                from:"noreplaymedimapangola@gmail.com",
                to: email,
                html: ResetPasswordTemplate(token),
            })
            
            await EmailSent.SendEmail()
            return res.status(200).json({success: true, message:"Verifique a sua caixa de email"})
        } catch (error) {
            console.error(error)
            return res.status(500).json({success: false, message: "Estamos tentando resolver este problema, por favor tente novamente."})
        }
    }

    static async ResetPassword(req: Request, res: Response): Promise<Response>
    {
        try {
            const { newPassword } = req.body;
            const { auth } = req.query as { auth: string };
                
            if (!auth || !newPassword) {
                return res.status(400).json({ success: false, message: "Por favor, verifique se preencheu todos os campos" });
            }
            const reset = await prisma.recuperacao_senha.findUnique({
                where: { token: auth },
                include: { conta: true }
            });
    
            if (!reset || reset.expiracao < new Date() || reset.usado) {
                return res.status(400).json({ success: false, message: "Token inválido ou expirado" });
            }
    
            if (ValidatorProps.validatePassword(newPassword) == false) {
                return res.status(400).json({
                    success: false,
                    message: "A senha deve ter pelo menos 8 caracteres, conter uma letra maiúscula, um número e um caractere especial.",
                });
            }
            const conta = reset.conta
            if (!conta)
            {
                return res.status(400).json({ success: false, message: "Credenciais não encontradas" });
            }
    
            const hashedPassword = await PasswordService.hashPassword(newPassword);
            await prisma.contas.update({
                where: { id_conta: reset.id_conta_fk! },
                data: { password: hashedPassword }
            });
    
            await prisma.recuperacao_senha.update({
                where: { token: auth },
                data: { usado: true }
            });
    
            return res.status(200).json({ success: true, message: "Senha alterada com sucesso" });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." });
        }
    }
    
   
}