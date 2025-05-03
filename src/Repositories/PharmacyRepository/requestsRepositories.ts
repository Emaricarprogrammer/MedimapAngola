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

    async getOrdersDetails(id_deposito: string) {
      const page = 1;
      const limit = 10;
      const skip = (page - 1) * limit;
  
      // 1. Verifica se o depósito existe
      const deposito = await this.prisma.entidades.findUnique({
          where: { 
              id_entidade: id_deposito,
              tipo_entidade: 'deposito' 
          }
      });
  
      if (!deposito) {
          return {
              orders: [],
              pagination: {
                  totalPages: 0,
                  totalItems: 0,
                  itemsPerPage: limit,
                  currentPage: page
              }
          };
      }
  
      // 2. Conta os pedidos distintos (aquisicao)
      const totalRequests = await this.prisma.aquisicao.count({
          where: {
              aquisicao_medicamento: {
                  some: {
                      medicamento: {
                          id_entidade_fk: id_deposito
                      }
                  }
              }
          }
      });
  
      const totalPages = Math.ceil(totalRequests / limit);
  
      // 3. Busca os pedidos completos com medicamentos
      const pedidos = await this.prisma.aquisicao.findMany({
          skip,
          take: limit,
          where: {
              aquisicao_medicamento: {
                  some: {
                      medicamento: {
                          id_entidade_fk: id_deposito
                      }
                  }
              }
          },
          include: {
              entidade: { // Farmacia
                  include: {
                      contacto_entidade: true,
                      endereco_entidade: true
                  }
              },
              aquisicao_medicamento: {
                  where: {
                      medicamento: {
                          id_entidade_fk: id_deposito
                      }
                  },
                  include: {
                      medicamento: true
                  }
              }
          },
          orderBy: { createdAt: "desc" }
      });
  
      // 4. Formata a resposta agrupando medicamentos
      const formattedOrders = pedidos.map(pedido => {
          const farmacia = pedido.entidade;
          const contacto = farmacia.contacto_entidade?.[0]?.contacto || '';
          const endereco = farmacia.endereco_entidade?.[0] || {};
  
          return {
              id_aquisicao: pedido.id_aquisicao,
              data_aquisicao: pedido.data_aquisicao,
              status: pedido.status,
              farmacia: {
                  id: farmacia.id_entidade,
                  nome: farmacia.firma_entidade,
                  contacto,
                  endereco: {
                      rua: endereco.rua || '',
                      cidade: endereco.cidade || '',
                      numero: endereco.numero || ''
                  }
              },
              medicamentos: pedido.aquisicao_medicamento.map(item => ({
                  id_medicamento: item.medicamento.id_medicamento,
                  nome_medicamento: item.medicamento.nome_comercial_medicamento,
                  preco: item.medicamento.preco_medicamento,
                  quantidade: pedido.quantidade_aquisicao, // Ou outra lógica de quantidade
                  validade: dayjs(item.medicamento.validade_medicamento).format('DD-MM-YYYY'),
                  imagem_url: item.medicamento.imagem_url
              })),
              total_compra: pedido.total_compra
          };
      });
  
      return {
        allRequests: formattedOrders,
          pagination: {
              totalPages,
              totalItems: totalRequests,
              itemsPerPage: limit,
              currentPage: page
          }
      };
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

        const allOrders = await this.prisma.aquisicao.findMany({where:{id_entidade_fk: id_farmacia}, include:{aquisicao_medicamento:{include:{medicamento:{include:{categoria:true, deposito: true}}}}, entidade:true}, skip: skip, take: limit})
        const totalOrders = await this.prisma.aquisicao.count({where:{id_entidade_fk: id_farmacia}})
        if (totalOrders == 0)
        {
            return null
        }

        const allPharmacyOrders =  pharmacyOrders.map(order => ({
            pedidos: allOrders.map(pedido => ({
                data_aquisicao: pedido.data_aquisicao,
                quantidade_medicamentos: pedido.quantidade_aquisicao,
                id_aquisicao: pedido.id_aquisicao,
                status: pedido.status,
                medicamento: pedido.aquisicao_medicamento.map(medicamento => ({
                id_medicamento: medicamento.medicamento.id_medicamento,
                nome_medicamento: medicamento.medicamento.nome_comercial_medicamento,
                preco: medicamento.medicamento.preco_medicamento,
                firma_deposito: medicamento.medicamento.deposito.firma_entidade,
                categoria_medicamento: medicamento.medicamento.categoria.nome_categoria_medicamento,
                validade: dayjs(medicamento.medicamento.validade_medicamento).format("DD-MM-YY"),
                createdAt: medicamento.medicamento.createdAt,
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

