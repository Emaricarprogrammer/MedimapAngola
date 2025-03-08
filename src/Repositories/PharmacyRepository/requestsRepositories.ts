import { PrismaClient, Prisma } from '@prisma/client'
import { RequestMedicineDatas, IRequestMedicineRepositories } from '../../Interfaces/RequestMedicineInterface/interface';
export class RequestsRepositories implements IRequestMedicineRepositories
{
    private prisma: PrismaClient;
    constructor(prisma: PrismaClient)
    {
        this.prisma = prisma;
    }

    async createRequest(requestDatas: RequestMedicineDatas): Promise<RequestMedicineDatas | any>
    {
        return await this.prisma.aquisicao.create({data:{...requestDatas}})    
    }
}