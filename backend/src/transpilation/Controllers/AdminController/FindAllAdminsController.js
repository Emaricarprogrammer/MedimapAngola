"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllAdminsController = void 0;
const AdminRepository_1 = require("../../Repositories/AdminRepository/AdminRepository");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const AdminRepositoryInstance = new AdminRepository_1.AdminRepository(prisma);
class FindAllAdminsController {
    static async findAllAdmin(req, res) {
        try {
            const AdminsDatas = await AdminRepositoryInstance.findAllAdmin();
            if (!AdminsDatas) {
                return res.status(400).json({ success: false, message: "Ooooooops! Não foi possível encontrar estes usuário, por favor tente novamente" });
            }
            return res.status(200).json({ success: 200, response: AdminsDatas });
        }
        catch (error) {
            console.log("Houve um erro: ", error.message);
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
        }
    }
}
exports.FindAllAdminsController = FindAllAdminsController;
