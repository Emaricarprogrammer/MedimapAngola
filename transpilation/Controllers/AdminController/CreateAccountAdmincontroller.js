"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdminRepository_1 = require("../../Repositories/AdminRepository/AdminRepository");
const client_1 = require("@prisma/client");
const AccountRespository_1 = require("../../Repositories/AccountRepository/AccountRespository");
const validators_1 = require("../../Utils/Validators/validators/validators");
const SendEmail_1 = require("../../Utils/providers/SendEmails/SendEmail");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const AdminRepositoryInstance = new AdminRepository_1.AdminRepository(prisma);
const AccountRepositoryInstance = new AccountRespository_1.AccountRepository(prisma);
class CreateAccountAdminController {
    async CreateAdminAccount(req, res) {
        try {
            let { username, email, password, nivel_acesso } = req.body;
            const { username_sanitized, nivel_acesso_sanitized, email_sanitized, password_sanitized } = validators_1.ValidatorProps.sanitizeInput(username, email, password, nivel_acesso);
            if (!username_sanitized || !nivel_acesso_sanitized || !email_sanitized || !password_sanitized) {
                return res.status(400).json({ success: false, message: "Por favor, verifique se preencheu todos os campos" });
            }
            if (!["admin", "gestor"].includes(nivel_acesso.toLowerCase())) {
                return res.status(400).json({ success: false, message: "Ooooops! Parece que seu nivel de acesso está incorrecto" });
            }
            if (!validators_1.ValidatorProps.IsVAlidEmail) {
                return res.status(400).json({ success: false, message: "Oooooops! Este formato de email é inválido." });
            }
            const EmailExists = await validators_1.ValidatorProps.EmailExists(email_sanitized);
            if (EmailExists) {
                return res.status(400).json({ success: false, message: "Oooooops! Este email já está sendo usado, tente usar outro." });
            }
            if (validators_1.ValidatorProps.validatePassword(password_sanitized) == false) {
                return res.status(400).json({ success: false, message: "A sua senha deve ter pelo menos 8 caracteres, conter uma letra maiúscula, um número e um caractere especial." });
            }
            const AccountCreated = await AccountRepositoryInstance.createAccount({ email: email_sanitized, password: password_sanitized });
            if (!AccountCreated || !AccountCreated.id_conta) {
                return res.status(400).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
            }
            const AdminDatas = { username: username_sanitized, nivel_acesso, id_conta_fk: AccountCreated.id_conta };
            const AdminCreated = await AdminRepositoryInstance.createAdmin(AdminDatas);
            if (!AdminCreated) {
                console.log("Nao foi possivel criar este admin");
                return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
            }
            const AdminCreatedResponse = {
                id_admin: AdminCreated.id_admin,
                username: AdminCreated.username,
                email: AccountCreated.email,
                nivel_acesso: AdminCreated.nivel_acesso,
                id_conta_fk: AdminCreated.id_conta_fk,
                createdAt: AdminCreated.createdAt
            };
            const sendEmailInstance = new SendEmail_1.EmailSender({
                text: "A equipa da MediMapAngola da-lhe as boas vindas",
                subject: "Welcome",
                from: "noreplaymedimapangola@gmail.com",
                to: email,
                html: process.env.HTML
            });
            sendEmailInstance.SendEmail().then((result) => { console.log("Email enviado com sucesso"); })
                .catch((err) => { console.log("Erro ao enviar email"); });
            return res.status(201).json({ success: true, message: "Usário com sucesso", response: AdminCreatedResponse });
        }
        catch (error) {
            console.error("Houve um erro: ", error);
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
        }
    }
}
exports.default = CreateAccountAdminController;
