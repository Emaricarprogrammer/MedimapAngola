"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllMedicinesController = void 0;
const client_1 = require("@prisma/client");
const MedicineRepository_1 = require("../../../Repositories/DepositRepositories/MedicineRepository/MedicineRepository");
const prisma = new client_1.PrismaClient();
const MedicineRepositoryInstance = new MedicineRepository_1.MedicineRepositories(prisma);
class FindAllMedicinesController {
    static async FindMedicines(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const pageNumer = parseInt(page, 10);
            const pageSize = parseInt(limit, 10);
            const skip = (pageNumer - 1) * pageSize;
            const MedicineResult = await MedicineRepositoryInstance.findAllMedicine(skip, pageSize);
            if (!MedicineResult) {
                return res.status(404).json({ success: false, message: "Ooooops! Infelizmente não conseguimos encontrar este medicamento" });
            }
            return res.status(200).json({ success: true, response: MedicineResult });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." });
        }
    }
}
exports.FindAllMedicinesController = FindAllMedicinesController;
