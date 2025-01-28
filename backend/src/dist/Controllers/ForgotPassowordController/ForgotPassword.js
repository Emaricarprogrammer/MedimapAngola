"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordController = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const SendEmail_1 = require("../../Utils/providers/SendEmails/SendEmail");
const dotenv_1 = __importDefault(require("dotenv"));
const passwordService_1 = require("../../Utils/PasswordService/passwordService");
const validators_1 = require("../../Utils/Validators/validators/validators");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
class ForgotPasswordController {
    static async ForgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ success: false, message: "Por favor, verifique se preencheu todos os campos" });
            }
            const user = await prisma.contas.findUnique({ where: { email: email } });
            if (!user) {
                return res.status(400).json({ success: false, message: "E-mail não encontrado" });
            }
            const token = crypto_1.default.randomBytes(32).toString("hex");
            await prisma.recuperacao_senha.create({ data: { token, expiracao: new Date(Date.now() + 3600000), id_conta_fk: user.id_conta, usado: false } });
            const EmailSent = new SendEmail_1.EmailSender({
                text: "Recuperação de Senha.",
                subject: "Recuperação de Senha",
                from: "noreplaymedimapangola@gmail.com",
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
            });
            await EmailSent.SendEmail();
            return res.status(200).json({ success: true, message: "Verifique a sua caixa de email" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
        }
    }
    static async ResetPassword(req, res) {
        try {
            const { password, newPassword } = req.body;
            const { authtoken } = req.query;
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
            if (validators_1.ValidatorProps.validatePassword(password) == false) {
                return res.status(400).json({
                    success: false,
                    message: "A senha deve ter pelo menos 8 caracteres, conter uma letra maiúscula, um número e um caractere especial.",
                });
            }
            const conta = reset.conta;
            const isPasswordValid = await passwordService_1.PasswordService.PasswordCompare(password, conta?.password);
            if (!isPasswordValid) {
                console.log(isPasswordValid);
                return res.status(400).json({ success: false, message: "A senha atual não foi encontrada" });
            }
            const hashedPassword = await passwordService_1.PasswordService.hashPassword(newPassword);
            await prisma.contas.update({
                where: { id_conta: reset.id_conta_fk },
                data: { password: hashedPassword }
            });
            await prisma.recuperacao_senha.update({
                where: { token: authtoken },
                data: { usado: true }
            });
            return res.status(200).json({ success: true, message: "Senha alterada com sucesso" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
        }
    }
}
exports.ForgotPasswordController = ForgotPasswordController;
