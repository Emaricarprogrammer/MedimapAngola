"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitiesRepositories = void 0;
class EntitiesRepositories {
    constructor(prisma) {
        this.Prisma = prisma;
    }
    async createEntity(entityDatas, tx) {
        const prismaClient = tx || this.Prisma;
        const entityCreated = await prismaClient.entidades.create({ data: { ...entityDatas } });
        return entityCreated;
    }
    async findEntity(id_entity, firma_entity) {
        if (id_entity) {
            const entityResults = await this.Prisma.entidades.findUnique({ where: { id_entidade: id_entity } });
            return entityResults;
        }
        else {
            const entityResults = await this.Prisma.entidades.findFirst({ where: { firma_entidade: firma_entity } });
            return entityResults;
        }
    }
    async updateEntity(id_entity, entityDatas, tx) {
        const prismaClient = tx || this.Prisma;
        const entityUpdated = await prismaClient.entidades.update({ where: { id_entidade: id_entity }, data: entityDatas });
        return entityUpdated;
    }
    async deleteEntity(id_entity) {
        const entityDeleted = await this.Prisma.entidades.delete({ where: { id_entidade: id_entity } });
        return entityDeleted;
    }
}
exports.EntitiesRepositories = EntitiesRepositories;
