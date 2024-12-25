import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { MedicineRepositories } from '../../Repositories/DepositRepositories/MedicineRepository/MedicineRepository';
import { CategoryMedicineRepositories } from '../../Repositories/DepositRepositories/CategoryMedicineRepository/CategoryRepository';

const prisma: PrismaClient = new PrismaClient()
const MedicineRepositoryInstance = new MedicineRepositories(prisma)
const CategoryMedicineRepositoryInstance = new CategoryMedicineRepositories(prisma)

export class CreateMedicineController
{
   static async  CreateMedicine (req: Request, res: Response): Promise<Response>
    {
        try{
        const {
            categoria_medicamento,
            nome_generico,
            nome_comercial,
            origem_medicamento,
            validade_medicamento,
            preco_medicamento,
            imagem_url,
            quantidade_disponivel
        } = req.body
        if (!categoria_medicamento 
            || !nome_generico || !nome_comercial 
            || !origem_medicamento || !validade_medicamento 
            || !preco_medicamento || !quantidade_disponivel || !imagem_url)
        {
            return res.status(400).json({ success: false, message: "Por favor, verifique se preencheu todos os campos" })
        }
        const CreatedCategory = await CategoryMedicineRepositoryInstance.createMedicineCategory(categoria_medicamento)
        if (!CreatedCategory || !CreatedCategory.id_categoria_medicamento)
        {
            return res.status(400).json({ success: false, message:"Estamos tentando resolver este problema, por favor tente novamente." })
        }
        const medicineDatas = {
            nome_generico_medicamento:nome_generico,
            nome_comercial_medicamento:nome_comercial,
            origem_medicamento:origem_medicamento,
            validade_medicamento:validade_medicamento,
            preco_medicamento:preco_medicamento,
            imagem_url:imagem_url,
            quantidade_disponivel_medicamento: quantidade_disponivel,
            id_categoria:CreatedCategory.id_categoria_medicamento
            }
        const CreatedMedicine = await MedicineRepositoryInstance.createMedicine(medicineDatas)
        if (!CreatedMedicine)
            {
                return res.status(400).json({success: false, message: "Houve um problema ao realizar esta operção, por favor tente mais tarde!"})
            }
            return res.status(201).json({success: true, message: "Medicamento cadastrado com sucesso", response: CreatedMedicine})
        }
         catch (error: any) {
            console.error("Houve um erro: ", error.message)
            return res.status(500).json({ success: false, message:"Estamos tentando resolver este problema, por favor tente novamente." })
        }
    }
}