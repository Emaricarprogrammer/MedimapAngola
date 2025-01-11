"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAdminController = void 0;
const client_1 = require("@prisma/client");
const AccountRespository_1 = require("../../../Repositories/AccountRepository/AccountRespository");
const AdminRepository_1 = require("../../../Repositories/AdminRepository/AdminRepository");
const validators_1 = require("../../../Utils/Validators/validators/validators");
const Prisma = new client_1.PrismaClient();
const AdminRepositoryInstance = new AdminRepository_1.AdminRepository(Prisma);
const AccountRepositoryInstance = new AccountRespository_1.AccountRepository(Prisma);
class DeleteAdminController {
    static async DeleteAdmin(req, res) {
        try {
            const { id_admin } = req.params;
            if (!id_admin) {
                console.log("Id invalido");
                return res.status(400).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
            }
            const AdminExists = await validators_1.ValidatorProps.AdminExists(id_admin);
            if (!AdminExists) {
                console.log("Usuário não encontrado");
                return res.status(404).json({ success: false, message: "Ooooops! Não foi possivel encontrar este usuário, por favor tente novamente." });
            }
            await Prisma.$transaction(async () => {
                await AdminRepositoryInstance.deleteAdmin(id_admin);
                const id_account = AdminExists.id_conta_fk;
                await AccountRepositoryInstance.deleteAccount(id_account);
            });
            return res.status(200).json({ success: true, message: "Dados deletados com sucesso" });
        }
        catch (error) {
            console.error("Houve um erro: ", error);
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
        }
    }
}
exports.DeleteAdminController = DeleteAdminController;
