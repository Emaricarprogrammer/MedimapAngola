import { Request, Response } from "express" 
import { PrismaClient } from "@prisma/client" 
import { EntitiesRepositories } from "../../../Repositories/EntityRepository/EntityRepository" 
import { calculateDistance } from "../../../Utils/providers/HaversineAlgorithm/algorithm" 

const prisma: PrismaClient = new PrismaClient() 
const EntitiesRepositoriesInstance: EntitiesRepositories = new EntitiesRepositories(prisma) 

export default class SearchDepositsController {
    static async search(req: Request, res: Response): Promise<Response> {
        try {
            const { longitude, latitude, distance } = req.query 

            if (!longitude || !latitude || !distance) {
                return res.status(400).json({
                    success: false,
                    message: "Os parâmetros longitude, latitude e distance são obrigatórios.",
                }) 
            }

            const longitudeNum = parseFloat(longitude as string) 
            const latitudeNum = parseFloat(latitude as string) 
            const distanceNum = parseFloat(distance as string) 

            if (isNaN(longitudeNum) || isNaN(latitudeNum) || isNaN(distanceNum)) {
                return res.status(400).json({
                    success: false,
                    message: "Os parâmetros longitude, latitude e distance devem ser números válidos.",
                }) 
            }

            if (latitudeNum < -90 || latitudeNum > 90 || longitudeNum < -180 || longitudeNum > 180) {
                return res.status(400).json({
                    success: false,
                    message: "Os valores de latitude e longitude são inválidos.",
                }) 
            }

            const depositsResults = await EntitiesRepositoriesInstance.findNearDeposits() 
            console.log("Depósitos encontrados: ", depositsResults) 

            if (!depositsResults || depositsResults.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Não conseguimos encontrar nenhum depósito, por favor recarregue a página.",
                }) 
            }

            const nearDeposits = [] 

            for (const deposit of depositsResults) {
                // Verifica se a geolocalização é válida
                if (
                    !deposit.geolocalizacao_entidade ||
                    typeof deposit.geolocalizacao_entidade.latitude !== "number" ||
                    typeof deposit.geolocalizacao_entidade.longitude !== "number" ||
                    deposit.geolocalizacao_entidade.latitude < -90 ||
                    deposit.geolocalizacao_entidade.latitude > 90 ||
                    deposit.geolocalizacao_entidade.longitude < -180 ||
                    deposit.geolocalizacao_entidade.longitude > 180
                ) {
                    console.log(`Depósito ${deposit.firma_entidade} tem geolocalização inválida.`) 
                    continue 
                }

                // Calcula a distância
                const depositDistance = calculateDistance(
                    latitudeNum,
                    longitudeNum,
                    deposit.geolocalizacao_entidade.latitude,
                    deposit.geolocalizacao_entidade.longitude
                )
                console.log(depositDistance)

                // Verifica se o depósito está dentro da distância especificada
                if (depositDistance <= distanceNum) {
                    nearDeposits.push({
                        ...deposit,
                        distance: depositDistance.toFixed(2),
                    }) 
                }
            }

            console.log("Depósitos próximos: ", nearDeposits) 

            if (nearDeposits.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Nenhum depósito encontrado no raio especificado.",
                }) 
            }

            return res.status(200).json({ success: true, response: nearDeposits }) 
        } catch (error) {
            console.error("Erro ao buscar depósitos próximos: ", error) 
            return res.status(500).json({
                success: false,
                message: "Estamos tentando resolver este problema, por favor tente novamente mais tarde.",
            }) 
        }
    }
}