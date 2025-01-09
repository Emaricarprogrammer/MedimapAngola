"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdminRepository_1 = require("../../Repositories/AdminRepository/AdminRepository");
const client_1 = require("@prisma/client");
const Prisma = new client_1.PrismaClient();
const AdminRepositoryInstance = new AdminRepository_1.AdminRepository(Prisma);
class FindAdminController {
    static async findAdmin(req, res) {
        try {
            const { id_admin } = req.params;
            if (!id_admin) {
                return res.status(400).json({ success: false, message: "Ooooops! Não conseguimos encontrar este usário, por favor tente novamente." });
            }
            const Results = await AdminRepositoryInstance.findAdmin(id_admin);
            if (!Results) {
                return res.status(400).json({ success: false, message: "Ooooops! Não conseguimos encontrar este usário, por favor tente novamente." });
            }
            const AdminDatas = {
                id_admin: Results?.id_admin,
                username: Results?.username,
                nivel_acesso: Results?.nivel_acesso,
                email: Results?.email,
                id_conta: Results?.id_conta,
                id_conta_fk: Results?.id_conta_fk
            };
            console.log("Dados retornados com sucesso: ", AdminDatas);
            return res.status(200).json({ success: true, response: AdminDatas });
        }
        catch (error) {
            console.error("Houve um erro: ", error);
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
        }
    }
}
exports.default = FindAdminController;
