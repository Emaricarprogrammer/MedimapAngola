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
    async updateContacts(contactsData) {
        const contactUpdated = await this.prisma.contactos.updateMany({ where: { id_entidade_fk: contactsData.id_entidade_fk }, data: { contacto: contactsData.contacto } });
        return contactUpdated;
    }
    async deleteContact(id_entity) {
        const contactDeleted = await this.prisma.contactos.deleteMany({ where: { id_entidade_fk: id_entity } });
        return contactDeleted;
    }
}
exports.ContactsRepository = ContactsRepository;
