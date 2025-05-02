import { Request, Response, NextFunction} from 'express';
import JWT from "jsonwebtoken"
import { jwtSecretKey } from '../../Utils/configs/private/secreteKey';
import dotenv from "dotenv"

dotenv.config()

type JwtPayload = {
    id_entidade: string;
    id_conta: string
    access_level: string;
}
export class AuthenticationController
{
    static async Authentication(req: Request, res: Response, next: NextFunction): Promise<any>
    {
        try {
            const token = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken
            if (!token)
            {
                return res.status(401).json({success: false, message:"Oooops! parece que você não está autorizado a acessar este recurso, por favor tente novamente."})
            }
    
            const decodedToken = await JWT.verify(token, jwtSecretKey.ACCESS_SECRET) as JwtPayload
            req.body.user = decodedToken
            next()
            
        } catch (error: any) {
            if (error.name === "TokenExpiredError")
            {
                return res.status(401).json({success: false, message: "Ooooops! Parece que a sua sessão está expirada, por favor faça login novamente", exp: true})
            }
            return res.status(401).json({ success: false, message: "Ooooops! Parece que você não tem autorização para acessar esta página." });
        }
    }

    static async AdminAuthentication(req: Request, res: Response, next: NextFunction): Promise<any>
    {
        if (req.body.user.access_level != "admin")
        {
            return res.status(401).json({success: false, message:"Ooooops! Parece que você não tem autorização para acessar este recurso."})
        }
        next()
    }

    static async PharmacyAuthentication(req: Request, res: Response, next: NextFunction): Promise<any>
    {
        if (req.body.user.access_level != "farmacia")
        {
            return res.status(401).json({success: false, message:"Ooooops! Parece que você não tem autorização para acessar este recurso."})
        }
        next()
    }

    static async DepositAuthentication(req: Request, res: Response, next: NextFunction): Promise<any>
    {
        if (req.body.user.access_level != "deposito")
        {
            return res.status(401).json({success: false, message:"Ooooops! Parece que você não tem autorização para acessar este recurso."})
        }
        next()
    }
}