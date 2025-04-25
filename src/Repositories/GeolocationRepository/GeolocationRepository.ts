import { PrismaClient, Prisma } from '@prisma/client';
import GeolocationDatas, {IGeolocation} from '../../Interfaces/GeolocationInterface/interface';
export class GeolocationRepository implements IGeolocation
{
    private prisma: PrismaClient;
    constructor(prisma: PrismaClient)
    {
        this.prisma = prisma;
    }
    async createGeolocation(geoDatas: GeolocationDatas, tx?: Omit<Prisma.TransactionClient, '$transaction'>): Promise<GeolocationDatas> {
        const prismaClient = tx || this.prisma
        const geolocation = await prismaClient.geolocalizacao.create({data:{...geoDatas}})
        return geolocation
        
    }

    async findGeolocation(id_entity: string): Promise<GeolocationDatas | any> {
        const geolocation = await this.prisma.geolocalizacao.findFirst({where:{id_entidade_fk: id_entity}})
        return geolocation
    }

    async deleteGeolocation(id_entity: string)
    {
        const geolocationDeleted = await this.prisma.geolocalizacao.deleteMany({where:{id_entidade_fk: id_entity}})
        return geolocationDeleted
    }
}