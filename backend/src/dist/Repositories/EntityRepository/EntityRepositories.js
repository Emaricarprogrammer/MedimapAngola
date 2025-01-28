"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntityRepositories {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createEntity(entityDatas, tx) {
        const prismaClient = tx || this.prisma;
        const createdEntity = await prismaClient.entidades.create({ data: { ...entityDatas } });
        return createdEntity;
    }
}
exports.default = EntityRepositories;
