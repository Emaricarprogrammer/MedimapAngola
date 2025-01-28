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
}