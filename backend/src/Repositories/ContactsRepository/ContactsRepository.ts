import { PrismaClient, Prisma, Entidades } from '@prisma/client';
import ContactsDatas, { IContactsRepositories } from "../../Interfaces/ContactInterface/interface";

export class ContactsRepository implements IContactsRepositories
{
    private prisma: PrismaClient;
    constructor(prisma: PrismaClient)
    {
        this.prisma = prisma;
    }
    async createContacts(contactsData: ContactsDatas,tx?: Omit<Prisma.TransactionClient, '$transaction'>): Promise<ContactsDatas | any> {
        const prismaCliente = tx || this.prisma
        const contactCreated = await prismaCliente.contactos.create({data:{...contactsData}})
        return contactCreated
    }

    async updateContacts(contactsData: ContactsDatas): Promise<ContactsDatas |any> {
        const contactUpdated = await this.prisma.contactos.updateMany({where:{id_entidade_fk:contactsData.id_entidade_fk}, data:{contacto: contactsData.contacto}})
       return contactUpdated
    }

    async deleteContact(id_entity: string)
    {
        const contactDeleted = await this.prisma.contactos.deleteMany({where:{id_entidade_fk: id_entity}})
        return contactDeleted
    }
}