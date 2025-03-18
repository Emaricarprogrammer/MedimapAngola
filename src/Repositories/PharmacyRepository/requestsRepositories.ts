import { PrismaClient, Prisma } from '@prisma/client'
import { RequestMedicineDatas, IRequestMedicineRepositories } from '../../Interfaces/RequestMedicineInterface/interface';
import { IRequestsMedicineDatas, RequestsMedicineDatas } from '../../Interfaces/RequestsMedicine/interface';
export class RequestsRepositories implements IRequestMedicineRepositories, IRequestsMedicineDatas
{
    private prisma: PrismaClient;
    constructor(prisma: PrismaClient)
    {
        this.prisma = prisma;
    }

    async createRequest(requestDatas: RequestMedicineDatas, tx?: Omit<Prisma.TransactionClient, "$transaction">): Promise<RequestMedicineDatas | any>
    {
        const prismaClient = tx || this.prisma
        return await prismaClient.aquisicao.create({data:{...requestDatas}})    
    }
    async createRequestsMedicines(requestsDatas: RequestsMedicineDatas, tx?: Omit<Prisma.TransactionClient, "$transaction">): Promise<any> {
        const prismaClient = tx || this.prisma
        return await prismaClient.aquisicao_medicamentos.create({data:{...requestsDatas}})
    }
}