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
    async findNearDeposits(): Promise<any> {
        const page = 1;
        const limit = 30;
        const skip = (page - 1) * limit;
        const deposits = await this.Prisma.entidades.findMany({
            where: { tipo_entidade: "deposito" },
            include: {
                geolocalizacao_entidade: true,
                contacto_entidade: true,
                credenciais_entidades: true,
                endereco_entidade: true,
                medicamentos: {
                    include: {
                        categoria: true
                    }
                }
            },
            skip: skip,
            take: limit
        });
        const totalDeposits = await this.Prisma.entidades.count({ where: { tipo_entidade: "deposito" } });
        const totalPages = Math.ceil(totalDeposits / limit);
        if (deposits == null) {
            return null;
        }
    
        return deposits.map((deposit) => {
            // Verifica se os arrays existem e têm elementos antes de acessar o índice [0]
            const contact = deposit.contacto_entidade && deposit.contacto_entidade.length > 0 ? deposit.contacto_entidade[0].contacto : null;
            const address = deposit.endereco_entidade && deposit.endereco_entidade.length > 0 ? deposit.endereco_entidade[0] : null;
            const geolocation = deposit.geolocalizacao_entidade && deposit.geolocalizacao_entidade.length > 0 ? deposit.geolocalizacao_entidade[0] : null;
    
            // Mapeia todos os medicamentos associados ao depósito
            const medicines = deposit.medicamentos ? deposit.medicamentos.map((medicine) => ({
                id_medicamento: medicine.id_medicamento,
                categoria: medicine.categoria.nome_categoria_medicamento,
                nome_generico: medicine.nome_generico_medicamento,
                nome_comercial: medicine.nome_comercial_medicamento,
                origem: medicine.origem_medicamento,
                validade: medicine.validade_medicamento,
                quantidade_disponivel: medicine.quantidade_disponivel_medicamento,
                preco: medicine.preco_medicamento,
                imagem: medicine.imagem_url
            })) : [];
    
            return {
                id_entidade: deposit.id_entidade,
                NIF_entidade: deposit.NIF_entidade,
                firma_entidade: deposit.firma_entidade,
                tipo_entidade: deposit.tipo_entidade,
                contacto: contact, // Pode ser null se o array estiver vazio
                logradouro: address?.logradouro,
                rua: address?.rua,
                numero: address?.numero,
                cidade: address?.cidade,
                pais: address?.pais,
                geolocalizacao_entidade: {
                    latitude: geolocation?.latitude,
                    longitude: geolocation?.longitude,
                },
                medicamentos: medicines, // Retorna todos os medicamentos associados
                createdAt: deposit.createdAt,
                updatedAt: deposit.updatedAt,
                id_conta_fk: deposit.id_conta_fk,
                pagination: {
                    totalPages: totalPages,
                    totalItems: totalDeposits,
                    itemsPerPage: limit
                }
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