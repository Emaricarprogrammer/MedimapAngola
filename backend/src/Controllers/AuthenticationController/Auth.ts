import { Request, Response, NextFunction} from 'express';
import { PrismaClient } from "@prisma/client";
import crypto from "crypto"
import JWT from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

type JwtPayload = {
    id_entidade: string;
    role: string;
}
export class AuthenticationController
{
    static async Authentication(req: Request, res: Response, next: NextFunction): Promise<any>
    {
        try {
            const token = req.headers.authorization?.split(' ')[1]
            if (!token)
            {
                console.log("Token nao fornecido")
                return res.status(401).json({success: false, message:"Oooops! parece que você não está autorizado a acessar este recurso, por favor tente novamente."})
            }
    
            const decodedToken = await JWT.verify(token, process.env.SUPER_SECRET_KEY!) as JwtPayload
            req.body.user = decodedToken
            console.log(decodedToken)
            next()
            
        } catch (error) {
            return res.status(401).json({ success: false, message: "Ooooops! Parece que você não tem autorização para acessar esta página." });
            
        }
    }

    }