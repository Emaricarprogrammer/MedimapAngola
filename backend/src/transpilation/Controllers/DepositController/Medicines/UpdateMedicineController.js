"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMedicineController = void 0;
const MedicineRepository_1 = require("../../../Repositories/DepositRepositories/MedicineRepository/MedicineRepository");
const client_1 = require("@prisma/client");
const validators_1 = require("../../../Utils/Validators/validators/validators");
const validator_1 = __importDefault(require("validator"));
const CategoryRepository_1 = require("../../../Repositories/DepositRepositories/CategoryMedicineRepository/CategoryRepository");
const prisma = new client_1.PrismaClient();
const MedicineRepositoryInstance = new MedicineRepository_1.MedicineRepositories(prisma);
const CategoryMedicineRepositoryInstance = new CategoryRepository_1.CategoryMedicineRepositories(prisma);
class UpdateMedicineController {
    static async UpdateMedicine(req, res) {
        try {
            const { id_medicamento } = req.params;
            const { categoria_medicamento, nome_generico_medicamento, nome_comercial_medicamento, origem_medicamento, validade_medicamento, preco_medicamento, imagem_url, quantidade_disponivel_medicamento } = req.body;
            const MedicineExists = await validators_1.ValidatorProps.MedicineExists(id_medicamento);
            if (!MedicineExists) {
                return res.status(404).json({ success: false, message: "Ooooops! Não conseguimos encontrar este médicamento, por favor tente novamente" });
            }
            if (!categoria_medicamento && !nome_generico_medicamento && !nome_comercial_medicamento &&
                !origem_medicamento && !validade_medicamento && !preco_medicamento &&
                !imagem_url && !quantidade_disponivel_medicamento) {
                return res.status(400).json({
                    success: false,
                    message: "Por favor, informe pelo menos um campo para atualização."
                });
            }
            const CategoryMedicine = {};
            const Medicines = {};
            if (categoria_medicamento) {
                CategoryMedicine.categoria_medicamento = validator_1.default.escape(categoria_medicamento);
            }
            if (nome_generico_medicamento) {
                Medicines.nome_generico_medicamento = validator_1.default.escape(nome_generico_medicamento);
            }
            if (nome_comercial_medicamento) {
                Medicines.nome_comercial_medicamento = validator_1.default.escape(nome_comercial_medicamento);
            }
            if (origem_medicamento) {
                Medicines.origem_medicamento = validator_1.default.escape(origem_medicamento);
            }
            if (validade_medicamento) {
                Medicines.validade_medicamento = validade_medicamento;
            }
            if (preco_medicamento) {
                if (!validator_1.default.isNumeric(preco_medicamento.toString())) {
                    return res.status(400).json({ success: false, message: "Preço inválido." });
                }
                Medicines.preco_medicamento = parseFloat(preco_medicamento);
            }
            if (imagem_url) {
                if (!validator_1.default.isURL(imagem_url)) {
                    return res.status(400).json({ success: false, message: "URL da imagem inválido." });
                }
                Medicines.imagem_url = imagem_url;
            }
            if (quantidade_disponivel_medicamento) {
                if (!validator_1.default.isInt(quantidade_disponivel_medicamento.toString())) {
                    return res.status(400).json({ success: false, message: "Quantidade inválida." });
                }
                Medicines.quantidade_disponivel_medicamento = parseInt(quantidade_disponivel_medicamento);
            }
            if (Object.keys(CategoryMedicine).length > 0) {
                const CategoryUpdated = await CategoryMedicineRepositoryInstance.updateMedicineCategory(MedicineExists.id_categoria, categoria_medicamento);
                if (!CategoryUpdated) {
                    return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
                }
            }
            let MedicineUpdated;
            if (Object.keys(Medicines).length > 0) {
                MedicineUpdated = await MedicineRepositoryInstance.updateMedicine(id_medicamento, Medicines);
                if (!MedicineUpdated) {
                    return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
                }
            }
            return res.status(200).json({ success: true, message: "Dados atualizados com sucesso.", response: MedicineUpdated });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Estamos a tentar resolver este problema, por favor tenta mais tarde!" });
        }
    }
}
exports.UpdateMedicineController = UpdateMedicineController;
