"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryMedicineRepositories = void 0;
class CategoryMedicineRepositories {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMedicineCategory(nomeCategoria) {
        const CategoryQuery = await this.prisma.categoria_Medicamentos.create({ data: { nome_categoria_medicamento: nomeCategoria } });
        console.log(CategoryQuery);
        return CategoryQuery || null;
    }
    async findMedicineCategory(nameCategory) {
        const CategoryQuery = await this.prisma.categoria_Medicamentos.findFirst({ where: { nome_categoria_medicamento: nameCategory } });
        return CategoryQuery;
    }
    async findAllCategoriesMedicine() {
        const CategoryQuery = await this.prisma.categoria_Medicamentos.findMany({ orderBy: { createdAt: "asc" } });
        return CategoryQuery;
    }
    async updateMedicineCategory(id_category, nameCategory) {
        const CategoryQuery = await this.prisma.categoria_Medicamentos.update({ where: { id_categoria_medicamento: id_category },
            data: {
                nome_categoria_medicamento: nameCategory
            }
        });
        return CategoryQuery;
    }
    async deleteMedicineCategory(idCategory) {
        const CategoryQuery = await this.prisma.categoria_Medicamentos.delete({ where: { id_categoria_medicamento: idCategory } });
        return CategoryQuery;
    }
}
exports.CategoryMedicineRepositories = CategoryMedicineRepositories;
