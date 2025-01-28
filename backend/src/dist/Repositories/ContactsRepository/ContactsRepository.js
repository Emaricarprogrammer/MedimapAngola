"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsRepository = void 0;
class ContactsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createContacts(contactsData, tx) {
        const prismaCliente = tx || this.prisma;
        const contactCreated = await prismaCliente.contactos.create({ data: { ...contactsData } });
        return contactCreated;
    }
}
exports.ContactsRepository = ContactsRepository;
