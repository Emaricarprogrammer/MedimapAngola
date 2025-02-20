import { Request, Response } from "express";
import { MedicineRepositories } from '../../../Repositories/DepositRepositories/MedicineRepository/MedicineRepository';
import { CategoryMedicineRepositories } from '../../../Repositories/DepositRepositories/CategoryMedicineRepository/CategoryRepository';
import { PrismaClient } from "@prisma/client";
import validator from "validator";
import { ValidatorProps } from "../../../Utils/Validators/validators/validators";
import cloudinary from "../../../Utils/providers/CloudinaryConfig";
import fs from "fs"
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
        quantidade_disponivel,
        id_entidade_fk,
      } = req.body;

      const imagem = req.file

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

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Por favor, verifique se preencheu todos os campos",
        });
      }

      // Validações específicas
      if (!validator.isDate(validade_medicamento)) {
        return res.status(400).json({
          success: false,
          message: "Por favor, forneça uma data de validade válida no formato AAAA-MM-DD.",
        });
      }

      if (!validator.isFloat(preco_medicamento.toString(), { min: 0})) {
        return res.status(400).json({
          success: false,
          message: "O preço deve ser um número válido maior ou igual a zero.",
        });
      }

      if (!validator.isInt(quantidade_disponivel.toString(), { min: 0 })) {
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
      const UploadResults = await cloudinary.uploader.upload(imagem.path,{
        folder: "medicamentos_imgs",
        public_id: nome_comercial,
        resource_type: "image"
      })

      if (!UploadResults || !UploadResults.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Erro ao fazer o upload da imagem. Por favor, tente novamente.",
        });
      }

      fs.unlinkSync(imagem.path)
      // Escapar caracteres para evitar XSS
      const sanitizedData = ValidatorProps.MedicineInputsSanitized(req.body)

      // Início da transação Prisma
      const result = await prisma.$transaction(async (tx) => {
        // Criação da categoria dentro da transação usando o repositório
        const CreatedCategory = await CategoryMedicineRepositoryInstance.createMedicineCategory(
          sanitizedData.categoria_medicamento,
          tx
        );

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

        const CreatedMedicine = await MedicineRepositoryInstance.createMedicine(
          medicineData,
          tx
        );

        if (!CreatedMedicine) {
          return res.status(400).json({
            success: false,
            message: "Não foi possível criar o medicamento. Tente novamente.",
          });
        }

        return CreatedMedicine; // Retorna o medicamento criado para uso fora da transação
      }, {timeout:1000});

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
    } catch (error: any) {
      console.error("Erro durante o cadastro do medicamento:", error);

      // Resposta de erro genérica
      return res.status(500).json({
        success: false,
        message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde.",
      });
    }
  }
}
