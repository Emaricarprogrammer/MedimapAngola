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
}
exports.AdressRepositories = AdressRepositories;
