"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMedicineController = void 0;
const client_1 = require("@prisma/client");
const MedicineRepository_1 = require("../../Repositories/DepositRepositories/MedicineRepository/MedicineRepository");
const CategoryRepository_1 = require("../../Repositories/DepositRepositories/CategoryMedicineRepository/CategoryRepository");
const prisma = new client_1.PrismaClient();
const MedicineRepositoryInstance = new MedicineRepository_1.MedicineRepositories(prisma);
const CategoryMedicineRepositoryInstance = new CategoryRepository_1.CategoryMedicineRepositories(prisma);
class CreateMedicineController {
    static async CreateMedicine(req, res) {
        try {
            const { categoria_medicamento, nome_generico, nome_comercial, origem_medicamento, validade_medicamento, preco_medicamento, imagem_url, quantidade_disponivel } = req.body;
            if (!categoria_medicamento
                || !nome_generico || !nome_comercial
                || !origem_medicamento || !validade_medicamento
                || !preco_medicamento || !quantidade_disponivel || !imagem_url) {
                return res.status(400).json({ success: false, message: "Por favor, verifique se preencheu todos os campos" });
            }
            const CreatedCategory = await CategoryMedicineRepositoryInstance.createMedicineCategory(categoria_medicamento);
            if (!CreatedCategory || !CreatedCategory.id_categoria_medicamento) {
                return res.status(400).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
            }
            const medicineDatas = {
                nome_generico_medicamento: nome_generico,
                nome_comercial_medicamento: nome_comercial,
                origem_medicamento: origem_medicamento,
                validade_medicamento: validade_medicamento,
                preco_medicamento: preco_medicamento,
                imagem_url: imagem_url,
                quantidade_disponivel_medicamento: quantidade_disponivel,
                id_categoria: CreatedCategory.id_categoria_medicamento
            };
            const CreatedMedicine = await MedicineRepositoryInstance.createMedicine(medicineDatas);
            if (!CreatedMedicine) {
                return res.status(400).json({ success: false, message: "Houve um problema ao realizar esta operção, por favor tente mais tarde!" });
            }
            return res.status(201).json({ success: true, message: "Medicamento cadastrado com sucesso", response: CreatedMedicine });
        }
        catch (error) {
            console.error("Houve um erro: ", error.message);
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
        }
    }
}
exports.CreateMedicineController = CreateMedicineController;
