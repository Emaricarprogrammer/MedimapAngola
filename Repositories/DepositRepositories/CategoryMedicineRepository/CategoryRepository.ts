import {PrismaClient} from "@prisma/client"
import CategoryMedicine, { ICategoryMedicine } from "../../../Interfaces/CategoryMedicineInterface/interface";

export class CategoryMedicineRepositories implements ICategoryMedicine
{
    private prisma: PrismaClient

    constructor(prisma: PrismaClient)
    {
        this.prisma = prisma
    }

    async createMedicineCategory(nomeCategoria: string): Promise<CategoryMedicine | null> {
        const CategoryQuery = await this.prisma.categoria_Medicamentos.create({data:{nome_categoria_medicamento:nomeCategoria}})
        console.log(CategoryQuery)
        return CategoryQuery || null
    }

    async findMedicineCategory(nameCategory: string): Promise<any> {
        const CategoryQuery = await this.prisma.categoria_Medicamentos.findFirst({where:{nome_categoria_medicamento:nameCategory}})
        return CategoryQuery
    }
    async findAllCategoriesMedicine(): Promise<CategoryMedicine | any> {
        const CategoryQuery = await this.prisma.categoria_Medicamentos.findMany({orderBy:{createdAt: "asc"}})
        return CategoryQuery
    }
    async updateMedicineCategory(id_category: string, nameCategory: string): Promise<CategoryMedicine> {
        const CategoryQuery = await this.prisma.categoria_Medicamentos.update({where:{id_categoria_medicamento:id_category},
            data:{
                nome_categoria_medicamento: nameCategory
            }
        })
        return CategoryQuery
    }
    
    async deleteMedicineCategory(idCategory: string): Promise<any> {
        const CategoryQuery = await this.prisma.categoria_Medicamentos.delete({where:{id_categoria_medicamento:idCategory}})
        return CategoryQuery
    }
    
}