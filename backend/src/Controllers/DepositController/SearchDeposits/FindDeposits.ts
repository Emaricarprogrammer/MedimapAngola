import { Request, response, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { EntitiesRepositories } from "../../../Repositories/EntityRepository/EntityRepository"
import { calculateDistance } from "../../../Utils/providers/HaversineAlgorithm/algorithm"

const prisma: PrismaClient = new PrismaClient()
const EntitiesRepositoriesInstance: EntitiesRepositories = new EntitiesRepositories(prisma)

export default class SearchDepositsController
{
    static async search(req: Request, res: Response): Promise<Response>
    {
        try
        {
            const {longitude, latitude, distance} = req.query
            console.log(longitude)
            if (!longitude || !latitude || !distance) {
                return res.status(400).json({
                    success: false,
                    message: "Os parâmetros longitude, latitude e distance são obrigatórios.",
                });
            }

            const Longitude = parseFloat(longitude as string);
            const Latitude = parseFloat(latitude as string);
            const Distance = parseFloat(distance as string);

            if (isNaN(Longitude) || isNaN(Latitude) || isNaN(Distance)) {
                return res.status(400).json({
                    success: false,
                    message: "Os parâmetros longitude, latitude e distance devem ser números válidos.",
                });
            }
            const depositsResults = await EntitiesRepositoriesInstance.findNearDeposits()
            if (depositsResults == null)
            {
                return res.status(400).json({ success: false, message: "Não conseguimos encontrar nenhum depósito, por favor recarregar a página." })    
            }
            const nearDeposits = []

            for (const depoist of depositsResults)
            {
                const geolocation = depoist.geolocalizacao_entidade[0]
                if (!geolocation) continue

                const depositDistance = calculateDistance(Latitude, Longitude, geolocation.latitude, geolocation.longitude)
                if (depositDistance<=Distance)
                {
                    nearDeposits.push({
                        ...depoist,
                        distance: depositDistance
                    })
                }
            }

            return res.status(200).json({success: true, response: nearDeposits})
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." }) 
        }
    }
}