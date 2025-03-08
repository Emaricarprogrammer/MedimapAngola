import { PrismaClient, Prisma} from "@prisma/client";
import { IAdressRepositories} from "../../Interfaces/AdressInterface/interface";
import AdressDatas from "../../Interfaces/AdressInterface/interface";

export class AdressRepositories implements IAdressRepositories
{
    private prisma: PrismaClient
    constructor(prisma: PrismaClient)
    {
        this.prisma = prisma
    }

    async createAdress(adressDatas: AdressDatas, tx?: Omit<Prisma.TransactionClient, '$transaction'>): Promise<AdressDatas> {
        const prismaCliente = tx || this.prisma
        console.log(adressDatas)
        const adressCreated = await prismaCliente.enderecos.create({data:{...adressDatas}})
        return adressCreated
    }

    async updateAdress(id_entity: string, adressDatas: Partial<AdressDatas>): Promise<AdressDatas | any>
    {
        const updatedAdress = await this.prisma.enderecos.updateMany({where: {id_entidade_fk: id_entity}, data:{...adressDatas}})
        return updatedAdress
    }
    async deleteAdress(id_entity: string)
    {
        const adressDeleted = await this.prisma.enderecos.deleteMany({where:{id_entidade_fk: id_entity}})
        return adressDeleted
    }
}