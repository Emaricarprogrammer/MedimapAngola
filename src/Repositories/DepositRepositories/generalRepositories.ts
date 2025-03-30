import { PrismaClient, Prisma } from '@prisma/client';
import EntityDatas, {IEntityRepositories} from "../../Interfaces/EntityInterface/interface"

class GeneralDepositsRepositories 
{
    private Prisma: PrismaClient
    constructor(prisma: PrismaClient)
    {
        this.Prisma = prisma
    }

    async findDeposit(id_deposit: string): Promise<EntityDatas | any> {
        const page = 1;
        const limit = 8;
        const skip = (page - 1) * limit;
        const totalMedicines = await this.Prisma.medicamentos.count({where:{id_entidade_fk: id_deposit}})
        const totalPages = Math.ceil(totalMedicines / limit);
        const DepositResults = await this.Prisma.entidades.findMany({where:{id_entidade: id_deposit}, 
            include:{endereco_entidade: true,contacto_entidade: true, credenciais_entidades: true, 
                geolocalizacao_entidade: true, medicamentos: {include: {categoria:true}}},
                skip: skip, take: limit})
    
        if (DepositResults == null)
        {
            return null
        }
            const depositDatas = {
                id_deposito: DepositResults[0].id_entidade,
                nif_deposito: DepositResults[0].NIF_entidade,
                firma_deposito: DepositResults[0].firma_entidade,
                contacto: DepositResults[0].contacto_entidade?.[0]?.contacto ?? null,
                logradouro: DepositResults[0].endereco_entidade?.[0]?.logradouro,
                rua: DepositResults[0].endereco_entidade?.[0]?.rua,
                numero: DepositResults[0].endereco_entidade?.[0]?.numero,
                cidade: DepositResults[0].endereco_entidade?.[0]?.cidade,
                pais: DepositResults[0].endereco_entidade?.[0]?.pais,
                geolocalizacao_deposito: {
                latitude: DepositResults[0].geolocalizacao_entidade?.[0]?.latitude,
                longitude: DepositResults[0].geolocalizacao_entidade?.[0]?.longitude,
                email: DepositResults[0].credenciais_entidades.email,
            },
            medicamentos_deposito: DepositResults.map((medicine) =>({
                id_medicamento: medicine.medicamentos[0].id_medicamento,
                categoria: medicine.medicamentos[0].categoria.nome_categoria_medicamento,
                nome_generico: medicine.medicamentos[0].nome_generico_medicamento,
                nome_comercial: medicine.medicamentos[0].nome_comercial_medicamento,
                origem: medicine.medicamentos[0].origem_medicamento,
                validade: medicine.medicamentos[0].validade_medicamento,
                quantidade_disponivel: medicine.medicamentos[0].quantidade_disponivel_medicamento,
                preco: medicine.medicamentos[0].preco_medicamento,
                imagem: medicine.medicamentos[0].imagem_url
            })),
            createdAt: DepositResults[0].createdAt,
            updatedAt: DepositResults[0].updatedAt,
            id_conta_fk: DepositResults[0].id_conta_fk
            }
            return {
                depositDatas,
                pagination:{
                    totalPages,
                    totalItems: totalMedicines,
                    itemsPerPage: limit,
                    currentPage: page
                }
            }
    }
    async findDeposits(): Promise<{ data: any[], pagination: any }>{
        const page = 1;
        const limit = 8;
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
    
        const totalDeposits = await this.Prisma.entidades.count({ 
            where: { tipo_entidade: "deposito" } 
        });
    
        const totalPages = Math.ceil(totalDeposits / limit);
    
        if (!deposits) {
            return {
                data: [],
                pagination: {
                    totalPages,
                    totalItems: totalDeposits,
                    itemsPerPage: limit,
                    currentPage: page
                }
            };
        }
    
        const data = deposits.map((deposit) => ({
            id_entidade: deposit.id_entidade,
            NIF_entidade: deposit.NIF_entidade,
            firma_entidade: deposit.firma_entidade,
            tipo_entidade: deposit.tipo_entidade,
            contacto: deposit.contacto_entidade?.[0]?.contacto ?? null,
            logradouro: deposit.endereco_entidade?.[0]?.logradouro,
            rua: deposit.endereco_entidade?.[0]?.rua,
            numero: deposit.endereco_entidade?.[0]?.numero,
            cidade: deposit.endereco_entidade?.[0]?.cidade,
            pais: deposit.endereco_entidade?.[0]?.pais,
            geolocalizacao_entidade: {
                latitude: deposit.geolocalizacao_entidade?.[0]?.latitude,
                longitude: deposit.geolocalizacao_entidade?.[0]?.longitude,
            },
            medicamentos: deposit.medicamentos?.map(medicine => ({
                id_medicamento: medicine.id_medicamento,
                categoria: medicine.categoria.nome_categoria_medicamento,
                nome_generico: medicine.nome_generico_medicamento,
                nome_comercial: medicine.nome_comercial_medicamento,
                origem: medicine.origem_medicamento,
                validade: medicine.validade_medicamento,
                quantidade_disponivel: medicine.quantidade_disponivel_medicamento,
                preco: medicine.preco_medicamento,
                imagem: medicine.imagem_url
            })) ?? [],
            createdAt: deposit.createdAt,
            updatedAt: deposit.updatedAt,
            id_conta_fk: deposit.id_conta_fk
        }));
    
        return {
            data,
            pagination: {
                totalPages,
                totalItems: totalDeposits,
                itemsPerPage: limit,
                currentPage: page
            }
        };
    }
    async MyMedicines(id_deposit: string):Promise<{ medicines: any[], pagination: any }>
    {
        const page = 1;
        const limit = 8;
        const skip = (page - 1) * limit;
        const deposits = await this.Prisma.medicamentos.findMany({where: { id_entidade_fk: id_deposit },include:{categoria:true},skip: skip,take: limit, orderBy: {createdAt:"desc"}})
        const totalMedicines = await this.Prisma.medicamentos.count({ where: { id_entidade_fk:id_deposit}})
        const totalPages = Math.ceil(totalMedicines / limit);
        
        const medicines = deposits.map((medicine) =>({
            id_medicamento: medicine.id_medicamento,
            categoria: medicine.categoria.nome_categoria_medicamento,
            nome_generico: medicine.nome_generico_medicamento,
            nome_comercial: medicine.nome_comercial_medicamento,
            origem: medicine.origem_medicamento,
            validade: medicine.validade_medicamento,
            quantidade_disponivel: medicine.quantidade_disponivel_medicamento,
            preco: medicine.preco_medicamento,
            imagem: medicine.imagem_url,
            createdAt: medicine.createdAt,
            updatedAt: medicine.updatedAt,
            }))
        return {
            medicines,
            pagination: {
                totalPages,
                totalItems: totalMedicines,
                itemsPerPage: limit,
                currentPage: page
                }
            }
        }
    
}

export {GeneralDepositsRepositories}