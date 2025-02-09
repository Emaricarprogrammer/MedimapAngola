"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdressRepositories = void 0;
class AdressRepositories {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createAdress(adressDatas, tx) {
        const prismaCliente = tx || this.prisma;
        console.log(adressDatas);
        const adressCreated = await prismaCliente.enderecos.create({ data: { ...adressDatas } });
        return adressCreated;
    }
    async updateAdress(id_entity, adressDatas) {
        const updatedAdress = await this.prisma.enderecos.updateMany({ where: { id_entidade_fk: id_entity }, data: { ...adressDatas } });
        return updatedAdress;
    }
    async deleteAdress(id_entity) {
        const adressDeleted = await this.prisma.enderecos.deleteMany({ where: { id_entidade_fk: id_entity } });
        return adressDeleted;
    }
}
exports.AdressRepositories = AdressRepositories;
