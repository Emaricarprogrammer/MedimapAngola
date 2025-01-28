import { PrismaClient, Prisma } from '@prisma/client';
import EntityDatas, {IEntityRepositories} from "../../Interfaces/EntityInterface/interface"
import { EmailSender } from '../../Utils/providers/SendEmails/SendEmail';

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
        console.log(entityDatas, entityCreated)
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
}