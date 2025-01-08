"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersMagementController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UsersMagementController {
    static async CountUsers(req, res) {
        try {
            const Users = await prisma.entidades.count();
            if (!Users) {
                return res.status(400).json({ success: false, message: "Oooops! Não foi possível retornar estes dados, por favor tente novamente." });
            }
            return res.status(200).json({ success: true, response: Users });
        }
        catch (error) {
            console.error("Houve um erro: ", error.message);
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, tente novamente" });
        }
    }
}
exports.UsersMagementController = UsersMagementController;
