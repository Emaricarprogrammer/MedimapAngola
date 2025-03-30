import { PrismaClient, Prisma } from '@prisma/client';
import MedicineDatas, { IMedicineRepositories } from "../../../Interfaces/MedicineInterface/interface";
import dayjs from "dayjs"
export class MedicineRepositories implements IMedicineRepositories
{
    private prisma: PrismaClient
    constructor(prisma: PrismaClient)
    {
        this.prisma = prisma
    }
    async createMedicine(medicineDatas: MedicineDatas, tx?: Omit<Prisma.TransactionClient, '$transaction'>): Promise<MedicineDatas | null> {
        const prismaCliente = tx || this.prisma
        const MedicineQuery = await prismaCliente.medicamentos.create({data:{...medicineDatas}})
        return MedicineQuery || null
        }

    async findMedicine(generic_name: string, comercial_name?:string, id?: string): Promise<MedicineDatas | any> {
        if (generic_name)
        {
            const MedicineQuery = await this.prisma.medicamentos.findFirst({where:{nome_generico_medicamento: generic_name}, include:{categoria:true,deposito:true}})
            if (MedicineQuery == null)
            {
                return null
            }
            const MedicineResult = {
                id_medicamento: MedicineQuery.id_medicamento,
                categoria: MedicineQuery.categoria.nome_categoria_medicamento,
                nome_generico: MedicineQuery.nome_generico_medicamento,
                nome_comercial: MedicineQuery.nome_comercial_medicamento,
                origem: MedicineQuery.origem_medicamento,
                validade: dayjs(MedicineQuery.validade_medicamento).format("DD/MM/YY"),
                quantidade_disponivel: MedicineQuery.quantidade_disponivel_medicamento,
                deposito: MedicineQuery?.deposito.firma_entidade,
                preco: MedicineQuery?.preco_medicamento,
                imagem: MedicineQuery?.imagem_url
            }
            return MedicineResult
        }
        else if(comercial_name)
        {
            const MedicineQuery = await this.prisma.medicamentos.findFirst({where:{nome_comercial_medicamento: comercial_name}, include:{categoria:true,deposito:true}})
            if (MedicineQuery == null)
                {
                    return null
                }
                const MedicineResult = {
                    id_medicamento: MedicineQuery.id_medicamento,
                    categoria: MedicineQuery.categoria.nome_categoria_medicamento,
                    nome_generico: MedicineQuery.nome_generico_medicamento,
                    nome_comercial: MedicineQuery.nome_comercial_medicamento,
                    origem: MedicineQuery.origem_medicamento,
                    validade: dayjs(MedicineQuery.validade_medicamento).format("DD/MM/YY"),
                    quantidade_disponivel: MedicineQuery.quantidade_disponivel_medicamento,
                    deposito: MedicineQuery?.deposito.firma_entidade,
                    preco: MedicineQuery?.preco_medicamento,
                    imagem: MedicineQuery?.imagem_url
                }
            return MedicineResult
        }
        else if(id)
            {
                const MedicineQuery = await this.prisma.medicamentos.findFirst({where:{id_medicamento: id}, include:{categoria:true,deposito:true}})
                if (MedicineQuery == null)
                    {
                        return null
                    }
                    const MedicineResult = {
                        id_medicamento: MedicineQuery.id_medicamento,
                        categoria: MedicineQuery.categoria.nome_categoria_medicamento,
                        nome_generico: MedicineQuery.nome_generico_medicamento,
                        nome_comercial: MedicineQuery.nome_comercial_medicamento,
                        origem: MedicineQuery.origem_medicamento,
                        validade: dayjs(MedicineQuery.validade_medicamento).format("DD/MM/YY"),
                        quantidade_disponivel: MedicineQuery.quantidade_disponivel_medicamento,
                        deposito: MedicineQuery?.deposito.firma_entidade,
                        preco: MedicineQuery?.preco_medicamento,
                        imagem: MedicineQuery?.imagem_url
                    }
                return MedicineResult
            }
            else{
                return null
            }
        
    }
    async findAllMedicine(): Promise<MedicineDatas | any>
    {
        const page = 1
        const limit = 9
        const skip = (page - 1) * limit;

        const MedicineQuery = await this.prisma.medicamentos.findMany({skip:skip,take:limit,include:{categoria:true, deposito:{include:{endereco_entidade:true}}}, orderBy:{validade_medicamento:"desc"}})
        if (MedicineQuery == null)
        {
            return null
        }
        const totalMedicines = await this.prisma.medicamentos.count()
        const totalPages = Math.ceil(totalMedicines/ limit)

        const MedicineResults = MedicineQuery.map((medicines => ({
            id_medicamento: medicines.id_medicamento,
            categoria: medicines.categoria.nome_categoria_medicamento,
            nome_generico: medicines.nome_generico_medicamento,
            nome_comercial: medicines.nome_comercial_medicamento,
            origem: medicines.origem_medicamento,
            validade: dayjs(medicines.validade_medicamento).format("DD/MM/YY"),
            quantidade_disponivel: medicines.quantidade_disponivel_medicamento,
            deposito:{
                id_deposito: medicines.deposito.id_entidade,
                firma_deposito: medicines.deposito.firma_entidade,
                logradouro: medicines.deposito.endereco_entidade[0].logradouro,
                rua: medicines.deposito.endereco_entidade[0].rua,
                numero_rua: medicines.deposito.endereco_entidade[0].numero,
                cidade: medicines.deposito.endereco_entidade[0].cidade,
            },
            preco: medicines.preco_medicamento,
            imagem: medicines.imagem_url
        })))
        return {
            MedicineResults,
            pagination: {
                totalPages,
                totalItems: totalMedicines,
                itemsPerPage: limit,
                currentPage: page
                }
        }
        }
        
    async updateMedicine(id_medicine: string, medicineDatas: Partial<MedicineDatas>): Promise<MedicineDatas | any> {
        const MedicineQuery = await this.prisma.medicamentos.update({
            where: {
                id_medicamento: id_medicine
            },
            data:{...medicineDatas}
        })
        return MedicineQuery
    }
    async deleteMedicine(id_medicine: string): Promise<any> {
        const MedicineQuery = await this.prisma.medicamentos.delete({where:{id_medicamento: id_medicine}})
        return MedicineQuery
    }

}