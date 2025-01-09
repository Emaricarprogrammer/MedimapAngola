import { Request, Response } from "express";
import { MedicineRepositories } from '../../../Repositories/DepositRepositories/MedicineRepository/MedicineRepository';
import { CategoryMedicineRepositories } from '../../../Repositories/DepositRepositories/CategoryMedicineRepository/CategoryRepository';
import { PrismaClient } from "@prisma/client";
import validator from "validator"

// Inicializa o Prisma Client
const prisma: PrismaClient = new PrismaClient();

// Instância dos Repositórios
const MedicineRepositoryInstance = new MedicineRepositories(prisma);
const CategoryMedicineRepositoryInstance = new CategoryMedicineRepositories(prisma);

export class CreateMedicineController {
  static async CreateMedicine(req: Request, res: Response): Promise<Response> {
    try {
      const {
        categoria_medicamento,
        nome_generico,
        nome_comercial,
        origem_medicamento,
        validade_medicamento,
        preco_medicamento,
        imagem_url,
        quantidade_disponivel,
        id_entidade_fk
      } = req.body;
      
      // Verificação de campos obrigatórios
      if (
        !categoria_medicamento ||
        !nome_generico || !nome_comercial ||
        !origem_medicamento || !validade_medicamento ||
        !preco_medicamento || !quantidade_disponivel || !imagem_url || !id_entidade_fk
      ) {
        return res.status(400).json({
          success: false,
          message: "Por favor, verifique se preencheu todos os campos",
        });
      }
      /*
      if (!validator.isURL(imagem_url))
        {
          return res.status(400).json({success: false, message: "Por favor, verifique a URL da imagem"})
        }
      */
        if (!validator.isDate(validade_medicamento))
        {
          return res.status(400).json({success: false, message: "Por favor, verifique e preencheu correctamente a data de validade do medicamento"})
        }
        
        if (!validator.isNumeric(preco_medicamento))
        {
          return res.status(400).json({success: false, message: "Por favor, verifique e preencheu correctamente o preço deste medicamento"})
        }
        
        if (!validator.isInt(quantidade_disponivel))
        {
          return res.status(400).json({success: false, message: "Por favor, verifique se preencheu correctamente a quantidade desejada."})
        }
      // Início da transação Prisma
      const result = await prisma.$transaction(async (tx) => {
        // Criação da categoria dentro da transação usando o repositório
        const CreatedCategory = await CategoryMedicineRepositoryInstance.createMedicineCategory(
          validator.escape(categoria_medicamento),
          tx // Passa a transação para o repositório
        );

        if (!CreatedCategory || !CreatedCategory.id_categoria_medicamento) {
            console.error("Erro ao criar conta")
            return res.status(400).json({
                success: false,
                message: "Ooooops!! Não foi possivel cadastrar este medicamento, por favor tente novamente",
              });
        }

        // Criação do medicamento dentro da transação usando o repositório
        const medicineData = {
          nome_generico_medicamento: validator.escape(nome_generico),
          nome_comercial_medicamento: validator.escape(nome_comercial),
          origem_medicamento: validator.escape(origem_medicamento),
          validade_medicamento: new Date(validade_medicamento), // Converte para Date
          preco_medicamento: parseFloat(preco_medicamento), // Converte para número decimal
          imagem_url: imagem_url,
          quantidade_disponivel_medicamento: parseInt(quantidade_disponivel), // Converte para inteiro
          id_categoria: CreatedCategory.id_categoria_medicamento,
          id_entidade_fk: id_entidade_fk
        };

        const CreatedMedicine = await MedicineRepositoryInstance.createMedicine(
          medicineData,
          tx // Passa a transação para o repositório
        );

        if (!CreatedMedicine)
        {
            console.error("Erro ao criar medicamnetos")
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
    } catch (error: any) {
      console.error("Houve um erro: ", error);
      return res.status(500).json({
        success: false,
        message: "Estamos tentando resolver este problema, por favor tente novamente.",
      });
    }
  }
}
