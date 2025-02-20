import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import crypto from "crypto"
import { EmailSender } from "../../Utils/providers/SendEmails/SendEmail";
import dotenv from "dotenv"
import { PasswordService } from '../../Utils/PasswordService/passwordService';
import { ValidatorProps } from "../../Utils/Validators/validators/validators";
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
                return res.status(400).json({success:false, message: "E-mail não encontrado"})
            }
            const token = crypto.randomBytes(32).toString("hex")
            await prisma.recuperacao_senha.create({data:{token, expiracao: new Date(Date.now() + 3600000), id_conta_fk: user.id_conta, usado:false}})
            const EmailSent = new EmailSender({
                text: "Recuperação de Senha.",
                subject: "Recuperação de Senha",
                from:"noreplaymedimapangola@gmail.com",
                to: email,
                html: `
        <p>Olá,</p>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta. Caso tenha sido você, use o link abaixo para criar uma nova senha:</p>
        <p>
            <a href="${process.env.RESET_URI}/reset_password?authtoken=${token}" target="_blank" style="color: #4CAF50; text-decoration: none; font-weight: bold;">
                Redefinir Senha
            </a>
        </p>
        <p><b>Ou copie e cole o seguinte link no navegador:</b></p>
        <p>${process.env.RESET_URI}/reset_password?authtoken=${token}</p>
        <p>Este link é válido por <strong>1 hora</strong>.</p>
        <p>Se você não solicitou a alteração de senha, ignore este e-mail. Sua conta permanecerá segura.</p>
        <p>Atenciosamente,</p>
        <p><b>Equipe MediMap Angola</b></p>
    `,
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
            const { password, newPassword } = req.body;
            const { authtoken } = req.query as { authtoken: string };
                
            if (!authtoken || !password || !newPassword) {
                return res.status(400).json({ success: false, message: "Por favor, verifique se preencheu todos os campos" });
            }
            const reset = await prisma.recuperacao_senha.findUnique({
                where: { token: authtoken },
                include: { conta: true }
            });
    
            if (!reset || reset.expiracao < new Date() || reset.usado) {
                return res.status(400).json({ success: false, message: "Token inválido ou expirado" });
            }
    
            if (ValidatorProps.validatePassword(password) == false) {
                return res.status(400).json({
                    success: false,
                    message: "A senha deve ter pelo menos 8 caracteres, conter uma letra maiúscula, um número e um caractere especial.",
                });
            }
            const conta = reset.conta;  
            const isPasswordValid = await PasswordService.PasswordCompare(password, conta?.password!);
    
            if (!isPasswordValid) {
                console.log(isPasswordValid)
                return res.status(400).json({ success: false, message: "A senha atual não foi encontrada" });
            }
    
            const hashedPassword = await PasswordService.hashPassword(newPassword);
            await prisma.contas.update({
                where: { id_conta: reset.id_conta_fk! },
                data: { password: hashedPassword }
            });
    
            await prisma.recuperacao_senha.update({
                where: { token: authtoken },
                data: { usado: true }
            });
    
            return res.status(200).json({ success: true, message: "Senha alterada com sucesso" });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." });
        }
    }
    
   
}