import { PrismaClient, Prisma } from '@prisma/client';
import EntityDatas, {IEntityRepositories} from "../../Interfaces/EntityInterface/interface"

class EntitiesRepositories implements IEntityRepositories
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
        const deposit = await this.Prisma.entidades.findMany({where:{tipo_entidade:"deposito"}, include:{geolocalizacao_entidade: true, contacto_entidade: true, credenciais_entidades: true, medicamentos: true, endereco_entidade: true, }})
        if (deposit == null)
        {
            return null
        }
        return deposit.map((deposits) => {
            // Verifica se os arrays têm elementos antes de acessar o índice [0]
            const contacto = deposits.contacto_entidade.length > 0 ? deposits.contacto_entidade[0].contacto : null;
            const endereco = deposits.endereco_entidade.length > 0 ? deposits.endereco_entidade[0] : null;
            const geolocalizacao = deposits.geolocalizacao_entidade.length > 0 ? deposits.geolocalizacao_entidade[0] : null;
    
            return {
                id_entidade: deposits.id_entidade,
                NIF_entidade: deposits.NIF_entidade,
                firma_entidade: deposits.firma_entidade,
                tipo_entidade: deposits.tipo_entidade,
                contacto: contacto, // Pode ser null se o array estiver vazio
                logradouro: endereco ? endereco.logradouro : null,
                rua: endereco ? endereco.rua : null,
                numero: endereco ? endereco.numero : null,
                cidade: endereco ? endereco.cidade : null,
                pais: endereco ? endereco.pais : null,
                geolocalizacao_entidade: geolocalizacao
                    ? {
                          latitude: geolocalizacao.latitude,
                          longitude: geolocalizacao.longitude,
                      }
                    : null, // Pode ser null se o array estiver vazio
                createdAt: deposits.createdAt,
                updatedAt: deposits.updatedAt,
                id_conta_fk: deposits.id_conta_fk,
            };
        });
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

export {EntitiesRepositories}