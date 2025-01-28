"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeolocationRepository = void 0;
class GeolocationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createGeolocation(geoDatas, tx) {
        const prismaClient = tx || this.prisma;
        const geolocation = await prismaClient.geolocalizacao.create({ data: { ...geoDatas } });
        return geolocation;
    }
}
exports.GeolocationRepository = GeolocationRepository;
