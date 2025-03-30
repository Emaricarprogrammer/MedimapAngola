import { Request, Response } from "express" 
import { jwtSecretKey} from "../../Utils/configs/private/secreteKey"
import { JwtOperation } from "../../Utils/configs/private/JwtOperations"
import dotenv from "dotenv" 

dotenv.config() 

type JwtPayload = {
    id_entidade: string 
    access_level: string 
} 

export default class RefreshTokenController {
    static async refreshToken(req: Request, res: Response): Promise<Response> {
        try
        {
            const {newToken} = req.cookies
            if (!newToken) {
                return res.status(401).json({ message: "Ocorreu um erro, por favor tente novamente!" });
            }
            const decodedToken: any = JwtOperation.verifyToken(newToken, jwtSecretKey.REFRESH_SECRET) as JwtPayload
            
            if (!decodedToken)
            {
                return res.status(401).json({ message: "Sua sessão não está inválida" });
            }
            const newAccessToken = JwtOperation.generateToken({
                id_entidade: decodedToken.id,
                access_level: decodedToken.access_level
            })
            return res.status(200).json({success: true, newAccessToken: newAccessToken})
        } catch (error: any) {
            console.error(error)
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ success: false, message: "Sua sessão expirou." });
            }
            return res.status(500).json({success: false, message: "Estamos tentando resolver este problema, tente novamente"})
        }
    }
}