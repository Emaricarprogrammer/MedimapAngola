"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdminAccountController = void 0;
const AdminRepository_1 = require("../../Repositories/AdminRepository/AdminRepository");
const client_1 = require("@prisma/client");
const AccountRespository_1 = require("../../Repositories/AccountRepository/AccountRespository");
const validators_1 = require("../../Utils/Validators/validators/validators");
const validator_1 = __importDefault(require("validator"));
const passwordService_1 = require("../../Utils/PasswordService/passwordService");
const Prisma = new client_1.PrismaClient();
const AdminRepositoryInstance = new AdminRepository_1.AdminRepository(Prisma);
const AccountRepositoryInstance = new AccountRespository_1.AccountRepository(Prisma);
class UpdateAdminAccountController {
    static async updateAdminAccount(req, res) {
        try {
            const { id_admin } = req.params;
            const { username, nivel_acesso, email, password } = req.body;
            if (!id_admin) {
                console.log("ID inválido");
                return res.status(400).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
            }
            const AdminExits = await validators_1.ValidatorProps.AdminExists(id_admin);
            if (!AdminExits) {
                console.log("Usuário não encontrado");
                return res.status(404).json({ success: false, message: "Oooooops! Não conseguimos encontrar este usário, por favor tente novamente." });
            }
            const AdminUpdateData = {};
            const AccountUpdateData = {};
            if (username) {
                AdminUpdateData.username = validator_1.default.escape(validator_1.default.trim(username));
            }
            if (nivel_acesso) {
                if (!["admin", "gestor"].includes(nivel_acesso.toLowerCase())) {
                    return res.status(400).json({ success: false, message: "Ooooops! Parece que seu nivel de acesso está incorrecto." });
                }
                AdminUpdateData.nivel_acesso = nivel_acesso.toLowerCase();
            }
            if (email) {
                if (!validator_1.default.isEmail(email)) {
                    return res.status(400).json({ success: false, message: "Oooooops! Este formato de email é inválido." });
                }
                const EmailExists = await validators_1.ValidatorProps.EmailExists(email);
                if (EmailExists) {
                    return res.status(400).json({ success: false, message: "Oooooops! Este email já está sendo usado, tente usar outro." });
                }
                AccountUpdateData.email = email;
            }
            if (password) {
                const HashedPassword = await passwordService_1.PasswordService.hashPassword(password);
                AccountUpdateData.password = HashedPassword;
            }
            else {
                return res.status(400).json({ success: false, message: "Por favor, informe pelo menos um campo para actualização." });
            }
            if (Object.keys(AccountUpdateData).length > 0) {
                const AccountUpdated = await AccountRepositoryInstance.updateAccount(AdminExits.id_conta_fk, AccountUpdateData);
                if (!AccountUpdated) {
                    return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
                }
            }
            if (Object.keys(AdminUpdateData).length > 0) {
                const AdminUpdated = await AdminRepositoryInstance.updateAdmin(id_admin, { username, nivel_acesso });
                if (!AdminUpdated) {
                    return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
                }
            }
            return res.status(200).json({ success: true, message: "Actualizado com sucesso" });
        }
        catch (error) {
            console.error("Houve um erro:", error);
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
        }
    }
}
exports.UpdateAdminAccountController = UpdateAdminAccountController;
