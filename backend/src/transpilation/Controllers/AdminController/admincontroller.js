"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdminService_1 = require("../../Services/AdminService/AdminService");
const AdminRepository_1 = require("../../Repositories/AdminRepository/AdminRepository");
const client_1 = require("@prisma/client");
const messages_1 = require("../../Utils/Messages/messages");
const AccountRespository_1 = require("../../Repositories/AccountRepository/AccountRespository");
const AccountService_1 = require("../../Services/AccountService/AccountService");
const validators_1 = require("../../Utils/Validators/validators/validators");
const Prisma = new client_1.PrismaClient();
const AdminRepositoryInstance = new AdminRepository_1.AdminRepository(Prisma);
const AccountRepositoryInstance = new AccountRespository_1.AccountRepository(Prisma);
const AccountServiceInstance = new AccountService_1.AccountService(AccountRepositoryInstance, Prisma);
const AdminServiceInstance = new AdminService_1.AdminService(AdminRepositoryInstance, Prisma);
class AdminController {
    async CreateAdminAccount(req, res) {
        try {
            const { username, nivel_acesso, email, password } = req.body;
            if (!username || !nivel_acesso || !email || !password) {
                return res.status(400).json({ success: false, message: messages_1.MESSAGES.EMPTY_DATAS, });
            }
            if (await validators_1.ValidatorProps.EmailExists(email)) {
                console.log("Este email ja esta em uso");
                return res.status(400).json({ success: false, message: messages_1.MESSAGES.ERROR_EMAIL_EXISTS, });
            }
            const accountCreated = await AccountServiceInstance.CreateAccount({ email, password }, Prisma);
            if (!accountCreated || !accountCreated.id_conta) {
                console.log("ID não informado");
                return res.status(400).json({ success: false, message: messages_1.MESSAGES.TRY_LATER });
            }
            const adminDatas = { username, nivel_acesso, id_conta_fk: accountCreated.id_conta };
            const adminCreated = await AdminServiceInstance.createAdminWithAccount(adminDatas, accountCreated.id_conta);
            if (!adminCreated) {
                console.log("Erro ao cadastrar administrador");
                return res.status(400).json({ success: false, message: messages_1.MESSAGES.TRY_LATER });
            }
            return res.status(201).json({ success: true, message: messages_1.MESSAGES.SUCCES_CREATED_ADMIN, data: adminCreated, });
        }
        catch (error) {
            console.error("Erro ao criar administrador:", error);
            return res.status(500).json({ success: false, message: messages_1.MESSAGES.ERROR_INTERNAL, });
        }
    }
}
exports.default = AdminController;
