import { PrismaClient, Prisma } from '@prisma/client'
import { RequestMedicineDatas, IRequestMedicineRepositories } from '../../Interfaces/RequestMedicineInterface/interface' 
import { IRequestsMedicineDatas, RequestsMedicineDatas } from '../../Interfaces/RequestsMedicine/interface' 
import dayjs from 'dayjs' 
export class RequestsRepositories implements IRequestMedicineRepositories, IRequestsMedicineDatas
{
    private prisma: PrismaClient 
    constructor(prisma: PrismaClient)
    {
        this.prisma = prisma 
    }

    async createRequest(requestDatas: RequestMedicineDatas, tx?: Omit<Prisma.TransactionClient, "$transaction">): Promise<RequestMedicineDatas | any>
    {
        const prismaClient = tx || this.prisma
        return await prismaClient.aquisicao.create({data:{...requestDatas, status: "pendente"}})    
    }
    async createRequestsMedicines(requestsDatas: RequestsMedicineDatas, tx?: Omit<Prisma.TransactionClient, "$transaction">): Promise<any> {
        const prismaClient = tx || this.prisma
        return await prismaClient.aquisicao_medicamentos.create({data:{...requestsDatas}})
    }

    async getOrdersDetails()
    {
        const pages = 1 
        const limit = 4
    
        const skip = (pages - 1) * limit 
        const totalRequests = await this.prisma.aquisicao_medicamentos.count() 
        const totalPages = Math.ceil(totalRequests / limit) 
    
        const orders = await this.prisma.aquisicao_medicamentos.findMany({
            skip: skip,
            take: limit,
            include: {
                aquisicao: {
                    include: {
                        entidade: {
                            include: {
                                contacto_entidade: true,
                                credenciais_entidades: true,
                                endereco_entidade: true
                            }
                        }
                    }
                },
                medicamento: true
            }, orderBy:{createdAt: "desc"}
        })

        const allOrders = await this.prisma.aquisicao_medicamentos.findMany({
            where: {
                aquisicao: {
                    entidade: {
                        id_entidade: orders[0].aquisicao.entidade.id_entidade
                    }
                }
            },
            include: {
                aquisicao: {
                    include: {
                        entidade: {
                            include: {
                                contacto_entidade: true,
                                credenciais_entidades: true,
                                endereco_entidade: true
                            }
                        }
                    }
                },
                medicamento: true
            }
        }) 
    
        const allRequests = orders.map(order => ({
            id_farmacia: order.aquisicao.entidade.id_entidade,
            firma_farmacia: order.aquisicao.entidade.firma_entidade,
            contacto: order.aquisicao.entidade.contacto_entidade[0].contacto,
            email: order.aquisicao.entidade.credenciais_entidades.email,
            endereco: {
                rua: order.aquisicao.entidade.endereco_entidade[0].rua,
                logradouro: order.aquisicao.entidade.endereco_entidade[0].logradouro,
                cidade: order.aquisicao.entidade.endereco_entidade[0].cidade,
                numero: order.aquisicao.entidade.endereco_entidade[0].numero
            },
            pedidos_farmacia: allOrders.map(pedido => ({
                    id_aquisicao: pedido.aquisicao.id_aquisicao,
                    total_medicamentos: pedido.aquisicao.quantidade_aquisicao,
                    nome_medicamento: pedido.medicamento.nome_comercial_medicamento,
                    preco: pedido.medicamento.preco_medicamento + "kz",
                    validade: dayjs(pedido.medicamento.validade_medicamento).format("DD-MM-YY"),
                    status: pedido.aquisicao.status
            }))
        }))

        return {
            allRequests,
            pagination: {
                totalPages,
                totalItems: totalRequests,
                itemsPerPage: limit,
                currentPage: pages
            }
        }
    }

    async setStatus(status: "concluido" | "cancelado", id_aquisicao: string): Promise<any> {
         const statusUpdated = await this.prisma.aquisicao.update({where:{id_aquisicao: id_aquisicao}, data:{status: status}})
         return statusUpdated
    }

    async getOrdersDetailsPharmacy(id_farmacia: string)
    {
        const pharmacyOrders = await this.prisma.entidades.findMany({where:{id_entidade:id_farmacia}, include:{aquisicao_medicamento: true}})
        const pages = 1 
        const limit = 9 
    
        const skip = (pages - 1) * limit 
        const totalRequests = await this.prisma.aquisicao_medicamentos.count({where:{aquisicao:{id_entidade_fk: id_farmacia}}, orderBy:{createdAt:"desc"}}) 
        const totalPages = Math.ceil(totalRequests / limit)

        if (pharmacyOrders.length == 0)
        {
            return null
        }

        const allOrders = await this.prisma.aquisicao.findMany({where:{id_entidade_fk: id_farmacia}, include:{aquisicao_medicamento:{include:{medicamento: true}}}, skip: skip, take: limit})
        const totalOrders = await this.prisma.aquisicao.count({where:{id_entidade_fk: id_farmacia}})
        if (totalOrders == 0)
        {
            return null
        }

        const allPharmacyOrders =  pharmacyOrders.map(order => ({
            pedidos: allOrders.map(pedido => ({
                data_aquisicao: dayjs(pedido.data_aquisicao).format("DD-MM-YY: HH:MM:ss"),
                quantidade_medicamentos: pedido.quantidade_aquisicao,
                id_aquisicao: pedido.id_aquisicao,
                status: pedido.status,
                medicamento: pedido.aquisicao_medicamento.map(medicamento => ({
                id_medicamento: medicamento.medicamento.id_medicamento,
                nome_medicamento: medicamento.medicamento.nome_comercial_medicamento,
                preco: medicamento.medicamento.preco_medicamento + "kz",
                validade: dayjs(medicamento.medicamento.validade_medicamento).format("DD-MM-YY"),
                total_compra: pedido.total_compra
            }))
                })),
            totalPedidos: totalOrders,
        }))

        return {
            orders: allPharmacyOrders,
            pagination: {
                totalPages,
                totalItems: totalRequests,
                itemsPerPage: limit,
                currentPage: pages
            }
        }
    } 
}

