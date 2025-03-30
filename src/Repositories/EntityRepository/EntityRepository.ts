import { PrismaClient, Prisma } from '@prisma/client';
import EntityDatas, {IEntityRepositories} from "../../Interfaces/EntityInterface/interface"
import dayjs from 'dayjs';

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
            const entityResults = await this.Prisma.entidades.findUnique({where:{id_entidade: id_entity}, include:{endereco_entidade: true,contacto_entidade: true, credenciais_entidades: true, geolocalizacao_entidade: true}})
            if (entityResults == null)
            {
                return null
            }
            const datas = {
                id_entidade: entityResults.id_entidade,
                NIF_entidade: entityResults.NIF_entidade,
                firma_entidade: entityResults.firma_entidade,
                tipo_entidade: entityResults.tipo_entidade,
                contacto: entityResults.contacto_entidade[0].contacto,
                email: entityResults.credenciais_entidades.email,
                logradouro: entityResults.endereco_entidade[0].logradouro,
                rua: entityResults.endereco_entidade[0].rua,
                numero: entityResults.endereco_entidade[0].numero,
                cidade: entityResults.endereco_entidade[0].cidade,
                pais: entityResults.endereco_entidade[0].pais,
                geolocalizacao_entidade: {
                    latitude: entityResults.geolocalizacao_entidade[0].latitude,
                    longitude: entityResults.geolocalizacao_entidade[0].longitude
                },
                createdAt: dayjs(entityResults.createdAt).format("DD:MM:YY HH:MM:ss"),
                updatedAt: dayjs(entityResults.updatedAt).format("DD:MM:YY HH:MM:ss")
            }
            return datas
        }
        else
        {
            const entityResults = await this.Prisma.entidades.findFirst({where:{firma_entidade: firma_entity}, include:{endereco_entidade: true,contacto_entidade: true, credenciais_entidades: true, geolocalizacao_entidade: true}})
            if (entityResults == null)
            {
                return null
            }
            const datas = {
                id_entidade: entityResults.id_entidade,
                NIF_entidade: entityResults.NIF_entidade,
                firma_entidade: entityResults.firma_entidade,
                tipo_entidade: entityResults.tipo_entidade,
                contacto: entityResults.contacto_entidade[0].contacto,
                email: entityResults.credenciais_entidades.email,
                logradouro: entityResults.endereco_entidade[0].logradouro,
                rua: entityResults.endereco_entidade[0].rua,
                numero: entityResults.endereco_entidade[0].numero,
                cidade: entityResults.endereco_entidade[0].cidade,
                pais: entityResults.endereco_entidade[0].pais,
                geolocalizacao_entidade: {
                    latitude: entityResults.geolocalizacao_entidade[0].latitude,
                    longitude: entityResults.geolocalizacao_entidade[0].longitude
                },
                createdAt: dayjs(entityResults.createdAt).format("DD:MM:YY HH:MM:ss"),
                updatedAt: dayjs(entityResults.updatedAt).format("DD:MM:YY HH:MM:ss")
            }
            return datas
        }
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