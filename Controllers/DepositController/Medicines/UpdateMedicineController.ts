import { Request, Response } from "express";
import { MedicineRepositories } from "../../../Repositories/DepositRepositories/MedicineRepository/MedicineRepository";
import { PrismaClient } from "@prisma/client";
import { ValidatorProps } from "../../../Utils/Validators/validators/validators";
import validator from "validator";
import { CategoryMedicineRepositories } from "../../../Repositories/DepositRepositories/CategoryMedicineRepository/CategoryRepository";

const prisma: PrismaClient = new PrismaClient();
const MedicineRepositoryInstance: MedicineRepositories = new MedicineRepositories(prisma);
const CategoryMedicineRepositoryInstance: CategoryMedicineRepositories = new CategoryMedicineRepositories(prisma);

export class UpdateMedicineController {
    static async UpdateMedicine(req: Request, res: Response): Promise<Response> {
        try {
            const { id_medicamento } = req.params;
            const {
                categoria_medicamento,
                nome_generico_medicamento,
                nome_comercial_medicamento,
                origem_medicamento,
                validade_medicamento,
                preco_medicamento,
                imagem_url,
                quantidade_disponivel_medicamento
            } = req.body;

            const MedicineExists = await ValidatorProps.MedicineExists(id_medicamento);
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

            const CategoryMedicine: Partial<{ categoria_medicamento: string }> = {};
            const Medicines: Partial<{ nome_generico_medicamento: string, nome_comercial_medicamento: string, origem_medicamento: string, validade_medicamento: Date, preco_medicamento: number, imagem_url: string, quantidade_disponivel_medicamento: number }> = {};

            if (categoria_medicamento) {
                CategoryMedicine.categoria_medicamento = validator.escape(categoria_medicamento);
            }
            if (nome_generico_medicamento) {
                Medicines.nome_generico_medicamento = validator.escape(nome_generico_medicamento);
            }
            if (nome_comercial_medicamento) {
                Medicines.nome_comercial_medicamento = validator.escape(nome_comercial_medicamento);
            }
            if (origem_medicamento) {
                Medicines.origem_medicamento = validator.escape(origem_medicamento);
            }
            if (validade_medicamento) {
                Medicines.validade_medicamento = validade_medicamento;
            }
            if (preco_medicamento) {
                if (!validator.isNumeric(preco_medicamento.toString())) {
                    return res.status(400).json({ success: false, message: "Preço inválido." });
                }
                Medicines.preco_medicamento = parseFloat(preco_medicamento);
            }
            if (imagem_url) {
                if (!validator.isURL(imagem_url)) {
                    return res.status(400).json({ success: false, message: "URL da imagem inválido." });
                }
                Medicines.imagem_url = imagem_url;
            }
            if (quantidade_disponivel_medicamento) {
                if (!validator.isInt(quantidade_disponivel_medicamento.toString())) {
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
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Estamos a tentar resolver este problema, por favor tenta mais tarde!" });
        }
    }
}
