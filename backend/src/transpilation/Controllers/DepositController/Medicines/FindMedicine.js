"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindMedicineController = void 0;
const client_1 = require("@prisma/client");
const MedicineRepository_1 = require("../../../Repositories/DepositRepositories/MedicineRepository/MedicineRepository");
const prisma = new client_1.PrismaClient();
const MedicineRepositoryInstance = new MedicineRepository_1.MedicineRepositories(prisma);
class FindMedicineController {
    static async FindMedicine(req, res) {
        try {
            const { nome_comercial, id } = req.params;
            if (!nome_comercial) {
                return res.status(400).json({ success: false, message: "Ooooops! Estamos tentando encontrar este medicamento, por favor tente novamente" });
            }
            const MedicineResult = await MedicineRepositoryInstance.findMedicine(nome_comercial);
            if (!MedicineResult) {
                return res.status(404).json({ success: false, message: "Ooooops! Infelizmente não conseguimos encontrar este medicamento" });
            }
            return res.status(200).json({ success: true, response: MedicineResult });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Estamos tentando solucionar este problema" });
        }
    }
}
exports.FindMedicineController = FindMedicineController;
