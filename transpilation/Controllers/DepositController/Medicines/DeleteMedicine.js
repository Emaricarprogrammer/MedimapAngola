"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMedicineController = void 0;
const client_1 = require("@prisma/client");
const MedicineRepository_1 = require("../../../Repositories/DepositRepositories/MedicineRepository/MedicineRepository");
const validators_1 = require("../../../Utils/Validators/validators/validators");
const prisma = new client_1.PrismaClient();
const MedicineRepositoryInstance = new MedicineRepository_1.MedicineRepositories(prisma);
class DeleteMedicineController {
    static async DeleteMedicine(req, res) {
        try {
            const { id_medicamento } = req.params;
            if (!id_medicamento) {
                console.log("ID nao fornecido");
                return res.status(400).json({ success: false, message: "Estamos tentando revolver este problema, por favor tente novamente." });
            }
            const VerifyMedicine = await validators_1.ValidatorProps.MedicineExists(id_medicamento);
            if (!VerifyMedicine) {
                return res.status(404).json({ success: false, message: "Ooooops! Não conseguimos encontrar este medicamento, por favor tente novamente!" });
            }
            const MedicineDeleted = await MedicineRepositoryInstance.deleteMedicine(id_medicamento);
            if (!MedicineDeleted) {
                return res.status(400).json({ success: false, message: "Estamos tentando revolver este problema, por favor tente novamente." });
            }
            return res.status(200).json({ success: true, message: "Medicamento deletado com sucesso." });
        }
        catch (error) {
            console.error("Houve um erro: ", error.message);
            return res.status(500).json({ sucess: false, message: "Ooooops! Estamos tentando resolver este problema, por favor tente novamente." });
        }
    }
}
exports.DeleteMedicineController = DeleteMedicineController;
