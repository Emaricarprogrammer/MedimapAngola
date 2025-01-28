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
        console.log(entityDatas, entityCreated);
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
}
exports.EntitiesRepositories = EntitiesRepositories;
