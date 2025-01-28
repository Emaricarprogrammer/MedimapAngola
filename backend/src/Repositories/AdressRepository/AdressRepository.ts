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
}