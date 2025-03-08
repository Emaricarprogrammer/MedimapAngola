import { PrismaClient, Prisma } from '@prisma/client';
import EntityDatas, {IEntityRepositories} from "../../Interfaces/EntityInterface/interface"

export class EntitiesRepositories implements IEntityRepositories
{
    private Prisma: PrismaClient
    constructor(prisma: PrismaClient)
    {
        this.Prisma = prisma
    }
    async createEntity(entityDatas: EntityDatas,tx?: Omit<Prisma.TransactionClient, '$transaction'>): Promise<EntityDatas> {
        const prismaClient = tx || this.Prisma
        const entityCreated = await prismaClient.entidades.create({data:{...entityDatas}})
        return entityCreated 
    }

    async findEntity(id_entity: string, firma_entity?: string): Promise<EntityDatas | any> {
        if (id_entity)
        {
            const entityResults = await this.Prisma.entidades.findUnique({where:{id_entidade: id_entity}})
            return entityResults
        }
        else
        {
            const entityResults = await this.Prisma.entidades.findFirst({where:{firma_entidade: firma_entity}})
            return entityResults
        }
    }
    async findNearDeposits(): Promise<any>
    {
        return await this.Prisma.entidades.findFirst({where:{tipo_entidade:"deposito"}, include:{geolocalizacao_entidade: true}})
    }
    async updateEntity(id_entity: string, entityDatas: Partial<EntityDatas>, tx?: Omit<Prisma.TransactionClient, "$transaction">): Promise<EntityDatas | any> {
        const prismaClient = tx || this.Prisma
        const entityUpdated = await prismaClient.entidades.update({where:{id_entidade: id_entity}, data: entityDatas})
        return entityUpdated
    }

    async deleteEntity(id_entity: string)
    {
        const entityDeleted = await this.Prisma.entidades.delete({where:{id_entidade: id_entity}})
        return entityDeleted
    }
}