"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMedicineController = void 0;
const MedicineRepository_1 = require("../../../Repositories/DepositRepositories/MedicineRepository/MedicineRepository");
const CategoryRepository_1 = require("../../../Repositories/DepositRepositories/CategoryMedicineRepository/CategoryRepository");
const client_1 = require("@prisma/client");
const validator_1 = __importDefault(require("validator"));
const validators_1 = require("../../../Utils/Validators/validators/validators");
const CloudinaryConfig_1 = __importDefault(require("../../../Utils/providers/CloudinaryConfig"));
// Inicializa o Prisma Client
const prisma = new client_1.PrismaClient();
// Instância dos Repositórios
const MedicineRepositoryInstance = new MedicineRepository_1.MedicineRepositories(prisma);
const CategoryMedicineRepositoryInstance = new CategoryRepository_1.CategoryMedicineRepositories(prisma);
class CreateMedicineController {
    static async CreateMedicine(req, res) {
        try {
            const { categoria_medicamento, nome_generico, nome_comercial, origem_medicamento, validade_medicamento, preco_medicamento, quantidade_disponivel, id_entidade_fk, } = req.body;
            const imagem = req.file;
            // Verificação de campos obrigatórios
            const missingFields = [
                "categoria_medicamento",
                "nome_generico",
                "nome_comercial",
                "origem_medicamento",
                "validade_medicamento",
                "preco_medicamento",
                "quantidade_disponivel",
                "id_entidade_fk",
            ].filter((field) => !req.body[field]);
            console.log(req.body);
            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Por favor, verifique se preencheu todos os campos",
                });
            }
            // Validações específicas
            if (!validator_1.default.isDate(validade_medicamento)) {
                return res.status(400).json({
                    success: false,
                    message: "Por favor, forneça uma data de validade válida no formato AAAA-MM-DD.",
                });
            }
            if (!validator_1.default.isFloat(preco_medicamento.toString(), { min: 0 })) {
                return res.status(400).json({
                    success: false,
                    message: "O preço deve ser um número válido maior ou igual a zero.",
                });
            }
            if (!validator_1.default.isInt(quantidade_disponivel.toString(), { min: 0 })) {
                return res.status(400).json({
                    success: false,
                    message: "A quantidade deve ser um número inteiro maior ou igual a zero.",
                });
            }
            /*
            if (!validator.isURL(imagem_url)) {
              return res.status(400).json({
                success: false,
                message: "A URL da imagem não é válida.",
              });
            }
              */
            if (!imagem || !imagem.path) {
                return res.status(400).json({
                    success: false,
                    message: "O arquivo de imagem é obrigatório.",
                });
            }
            const UploadResults = await CloudinaryConfig_1.default.uploader.upload(imagem.path, {
                folder: "medicamentos_imgs",
                public_id: nome_comercial,
                resource_type: "image"
            });
            if (!UploadResults || !UploadResults.secure_url) {
                return res.status(500).json({
                    success: false,
                    message: "Erro ao fazer o upload da imagem. Por favor, tente novamente.",
                });
            }
            // Escapar caracteres para evitar XSS
            const sanitizedData = validators_1.ValidatorProps.MedicineInputsSanitized(req.body);
            // Início da transação Prisma
            const result = await prisma.$transaction(async (tx) => {
                // Criação da categoria dentro da transação usando o repositório
                const CreatedCategory = await CategoryMedicineRepositoryInstance.createMedicineCategory(sanitizedData.categoria_medicamento, tx);
                if (!CreatedCategory?.id_categoria_medicamento) {
                    return res.status(400).json({
                        success: false,
                        message: "Não foi possível criar a categoria do medicamento. Tente novamente.",
                    });
                }
                // Criação do medicamento dentro da transação usando o repositório
                const medicineData = {
                    nome_generico_medicamento: sanitizedData.nome_generico,
                    nome_comercial_medicamento: sanitizedData.nome_comercial,
                    origem_medicamento: sanitizedData.origem_medicamento,
                    validade_medicamento: sanitizedData.validade_medicamento,
                    preco_medicamento: sanitizedData.preco_medicamento,
                    imagem_url: UploadResults.secure_url,
                    quantidade_disponivel_medicamento: sanitizedData.quantidade_disponivel,
                    id_categoria: CreatedCategory.id_categoria_medicamento,
                    id_entidade_fk: id_entidade_fk,
                };
                const CreatedMedicine = await MedicineRepositoryInstance.createMedicine(medicineData, tx);
                if (!CreatedMedicine) {
                    return res.status(400).json({
                        success: false,
                        message: "Não foi possível criar o medicamento. Tente novamente.",
                    });
                }
                return CreatedMedicine; // Retorna o medicamento criado para uso fora da transação
            });
            if (!result) {
                return res.status(400).json({
                    success: false,
                    message: "Ooooops! Estamos tentando resolver este problema, por favor tente novamente.",
                });
            }
            // Resposta de sucesso
            return res.status(201).json({
                success: true,
                message: "Medicamento cadastrado com sucesso.",
                response: result,
            });
        }
        catch (error) {
            console.error("Erro durante o cadastro do medicamento:", error);
            // Resposta de erro genérica
            return res.status(500).json({
                success: false,
                message: "Erro interno do servidor. Por favor, tente novamente mais tarde.",
            });
        }
    }
}
exports.CreateMedicineController = CreateMedicineController;
