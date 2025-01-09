"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMedicineController = void 0;
const MedicineRepository_1 = require("../../Repositories/DepositRepositories/MedicineRepository/MedicineRepository");
const CategoryRepository_1 = require("../../Repositories/DepositRepositories/CategoryMedicineRepository/CategoryRepository");
const client_1 = require("@prisma/client");
// Inicializa o Prisma Client
const prisma = new client_1.PrismaClient();
// Instância dos Repositórios
const MedicineRepositoryInstance = new MedicineRepository_1.MedicineRepositories(prisma);
const CategoryMedicineRepositoryInstance = new CategoryRepository_1.CategoryMedicineRepositories(prisma);
class CreateMedicineController {
    static async CreateMedicine(req, res) {
        try {
            const { categoria_medicamento, nome_generico, nome_comercial, origem_medicamento, validade_medicamento, preco_medicamento, imagem_url, quantidade_disponivel, id_entidade_fk } = req.body;
            // Verificação de campos obrigatórios
            if (!categoria_medicamento ||
                !nome_generico || !nome_comercial ||
                !origem_medicamento || !validade_medicamento ||
                !preco_medicamento || !quantidade_disponivel || !imagem_url || !id_entidade_fk) {
                return res.status(400).json({
                    success: false,
                    message: "Por favor, verifique se preencheu todos os campos",
                });
            }
            // Início da transação Prisma
            const result = await prisma.$transaction(async (tx) => {
                // Criação da categoria dentro da transação usando o repositório
                const CreatedCategory = await CategoryMedicineRepositoryInstance.createMedicineCategory(categoria_medicamento, tx // Passa a transação para o repositório
                );
                if (!CreatedCategory || !CreatedCategory.id_categoria_medicamento) {
                    console.error("Erro ao criar conta");
                    return res.status(400).json({
                        success: false,
                        message: "Ooooops!! Não foi possivel cadastrar este medicamento, por favor tente novamente",
                    });
                }
                // Criação do medicamento dentro da transação usando o repositório
                const medicineData = {
                    nome_generico_medicamento: nome_generico,
                    nome_comercial_medicamento: nome_comercial,
                    origem_medicamento: origem_medicamento,
                    validade_medicamento: new Date(validade_medicamento), // Converte para Date
                    preco_medicamento: parseFloat(preco_medicamento), // Converte para número decimal
                    imagem_url: imagem_url,
                    quantidade_disponivel_medicamento: parseInt(quantidade_disponivel), // Converte para inteiro
                    id_categoria: CreatedCategory.id_categoria_medicamento,
                    id_entidade_fk: id_entidade_fk
                };
                const CreatedMedicine = await MedicineRepositoryInstance.createMedicine(medicineData, tx // Passa a transação para o repositório
                );
                if (!CreatedMedicine) {
                    console.error("Erro ao criar medicamnetos");
                    return res.status(400).json({
                        success: false,
                        message: "Ooooops!! Não foi possivel cadastrar este medicamento, por favor tente novamente",
                    });
                }
                return CreatedMedicine; // Retorna o medicamento criado
            });
            // Resposta de sucesso
            return res.status(201).json({
                success: true,
                message: "Medicamento cadastrado com sucesso",
                response: result,
            });
        }
        catch (error) {
            console.error("Houve um erro: ", error.message);
            return res.status(500).json({
                success: false,
                message: "Estamos tentando resolver este problema, por favor tente novamente.",
            });
        }
    }
}
exports.CreateMedicineController = CreateMedicineController;
