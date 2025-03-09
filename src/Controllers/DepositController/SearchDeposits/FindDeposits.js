"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const EntityRepository_1 = require("../../../Repositories/EntityRepository/EntityRepository");
const algorithm_1 = require("../../../Utils/providers/HaversineAlgorithm/algorithm");
const prisma = new client_1.PrismaClient();
const EntitiesRepositoriesInstance = new EntityRepository_1.EntitiesRepositories(prisma);
class SearchDepositsController {
    static async search(req, res) {
        try {
            const { longitude, latitude, distance } = req.query;
            console.log(longitude);
            if (!longitude || !latitude || !distance) {
                return res.status(400).json({
                    success: false,
                    message: "Os parâmetros longitude, latitude e distance são obrigatórios.",
                });
            }
            const Longitude = parseFloat(longitude);
            const Latitude = parseFloat(latitude);
            const Distance = parseFloat(distance);
            if (isNaN(Longitude) || isNaN(Latitude) || isNaN(Distance)) {
                return res.status(400).json({
                    success: false,
                    message: "Os parâmetros longitude, latitude e distance devem ser números válidos.",
                });
            }
            const depositsResults = await EntitiesRepositoriesInstance.findNearDeposits();
            if (depositsResults == null) {
                return res.status(400).json({ success: false, message: "Não conseguimos encontrar nenhum depósito, por favor recarregar a página." });
            }
            const nearDeposits = [];
            for (const depoist of depositsResults) {
                const geolocation = depoist.geolocalizacao_entidade[0];
                if (!geolocation)
                    continue;
                const depositDistance = (0, algorithm_1.calculateDistance)(Latitude, Longitude, geolocation.latitude, geolocation.longitude);
                if (depositDistance <= Distance) {
                    nearDeposits.push({
                        ...depoist,
                        distance: depositDistance
                    });
                }
            }
            return res.status(200).json({ success: true, response: nearDeposits });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." });
        }
    }
}
exports.default = SearchDepositsController;
