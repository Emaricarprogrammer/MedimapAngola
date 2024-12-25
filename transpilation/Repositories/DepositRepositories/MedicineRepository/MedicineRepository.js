"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicineRepositories = void 0;
class MedicineRepositories {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMedicine(medicineDatas) {
        const MedicineQuery = await this.prisma.medicamentos.create({ data: { ...medicineDatas } });
        return MedicineQuery;
    }
    async findMedicine(id_medicine) {
        const MedicineQuery = await this.prisma.medicamentos.findUnique({ where: { id_medicamento: id_medicine } });
        return MedicineQuery;
    }
    async findAllMedicine() {
        const MedicineQuery = await this.prisma.medicamentos.findMany({ include: { categoria: true } });
        return MedicineQuery;
    }
    async updateMedicine(id_medicine, medicineDatas) {
        const MedicineQuery = await this.prisma.medicamentos.update({ where: { id_medicamento: id_medicine }, data: { ...medicineDatas } });
        return MedicineQuery;
    }
    async deleteMedicine(id_medicine) {
        const MedicineQuery = await this.prisma.medicamentos.delete({ where: { id_medicamento: id_medicine } });
        return MedicineQuery;
    }
}
exports.MedicineRepositories = MedicineRepositories;
