export default interface CategoryMedicine
{
    id_categoria_medicamento?: string;
    nome_categoria_medicamento: string
    createdAt: Date
    updatedAt: Date
}

export interface ICategoryMedicine
{
    createMedicineCategory(nomeCategoria: string): Promise<CategoryMedicine | null>
    findMedicineCategory(nameCategory: string): Promise<any>
    findAllCategoriesMedicine(): Promise<CategoryMedicine>
    updateMedicineCategory(idCategory: string, nameCategory: string): Promise<CategoryMedicine>
    deleteMedicineCategory(IdCategory: string): Promise<any>
}