import { PrismaClient, Prisma } from '@prisma/client';
import MedicineDatas, { IMedicineRepositories } from "../../../Interfaces/MedicineInterface/interface";

export class MedicineRepositories implements IMedicineRepositories
{
    private prisma: PrismaClient
    constructor(prisma: PrismaClient)
    {
        this.prisma = prisma
    }
    async createMedicine(medicineDatas: MedicineDatas): Promise<MedicineDatas | null> {
        const MedicineQuery = await this.prisma.medicamentos.create({data:{...medicineDatas}})
        return MedicineQuery
    }

    async findMedicine(id_medicine: string): Promise<MedicineDatas | any> {
        const MedicineQuery = await this.prisma.medicamentos.findUnique({where:{id_medicamento: id_medicine}})
        return MedicineQuery
    }
    async findAllMedicine(): Promise<MedicineDatas | any> {
        const MedicineQuery = await this.prisma.medicamentos.findMany({include:{categoria:true}})
        return MedicineQuery
    }

    async updateMedicine(id_medicine: string, medicineDatas: Partial<MedicineDatas>): Promise<MedicineDatas | any> {
        const MedicineQuery = await this.prisma.medicamentos.update({where:{id_medicamento:id_medicine}, data:{...medicineDatas}})
        return MedicineQuery
    }
    async deleteMedicine(id_medicine: string): Promise<any> {
        const MedicineQuery = await this.prisma.medicamentos.delete({where:{id_medicamento: id_medicine}})
        return MedicineQuery
    }
}