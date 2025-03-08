import { Request, Response } from "express" 
import JWT from "jsonwebtoken" 
import { jwtSecretKey} from "../../Utils/configs/private/secreteKey"
import { JwtOperation } from "../../Utils/configs/private/JwtOperations"
import dotenv from "dotenv" 

dotenv.config() 

type JwtPayload = {
    id_entidade: string 
    role: string 
} 

export default class RefreshTokenController {
    static async refreshToken(req: Request, res: Response): Promise<Response> {
        try
        {
            const {newToken} = req.cookies
            console.log("Seu token: ", res.getHeaders())

            if (!newToken) {
                return res.status(401).json({ message: "Refresh Token é obrigatório" });
            }
            const decodedToken: any = JwtOperation.verifyToken(newToken, jwtSecretKey.REFRESH_SECRET) as JwtPayload
            
            if (!decodedToken)
            {
                return res.status(401).json({ message: "Sua sessão não está inválida" });
            }
            const newAccessToken = JwtOperation.generateToken({
                id_entidade: decodedToken.id,
                role: decodedToken.role
            })
            return res.status(200).json({success: true, newAccessToken: newAccessToken})
        } catch (error: any) {
            console.error(error)
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ success: false, message: "Refresh Token expirado." });
            }
            return res.status(500).json({success: false, message: "Estamos tentando resolver este problema, tente novamente"})
        }
    }
}