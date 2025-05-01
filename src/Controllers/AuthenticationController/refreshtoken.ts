import { Request, Response } from "express" 
import { jwtSecretKey } from "../../Utils/configs/private/secreteKey" 
import { JwtOperation } from "../../Utils/configs/private/JwtOperations" 
import dotenv from "dotenv" 
import { PrismaClient } from "@prisma/client" 

dotenv.config() 

type JwtPayload = {
    id_entidade: string 
    id_conta: string 
    access_level: string
} 

const prisma = new PrismaClient() 

export default class RefreshTokenController {
        static async refreshToken(req: Request, res: Response): Promise<Response> {
            try {
                const { refreshToken } = req.cookies 
                if (!refreshToken) {
                    return res.status(401).json({ 
                        success: false,
                        message: "Token de sessão não fornecida" 
                    }) 
                }

                // Verifica o token JWT
                const decodedToken = JwtOperation.verifyToken(
                    refreshToken, 
                    jwtSecretKey.REFRESH_SECRET
                ) as JwtPayload 
                
                if (!decodedToken) {
                    return res.status(401).json({ 
                        success: false,
                        message: "Sessão inválida" 
                    }) 
                }
                // Busca o token no banco de dados
                const storedToken = await prisma.refreshTokens.findFirst({where:{token: refreshToken}})
                
                if (!storedToken) {
                    return res.status(401).json({ 
                        success: false,
                        message: "Sessão não encontrada" 
                    }) 
                }
                // Gera novo access token
                const newAccessToken = JwtOperation.generateToken({
                    id_entidade: decodedToken.id_entidade,
                    id_conta: decodedToken.id_conta,
                    access_level: decodedToken.access_level
                }) 
    
                // Gera NOVO refresh token (opcional - implementação mais segura)
                const newRefreshToken = JwtOperation.generateRefreshToken({
                    id_entidade: decodedToken.id_entidade,
                    id_conta: decodedToken.id_conta,
                    access_level: decodedToken.access_level
                }) 
                const newExpireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

                await prisma.$transaction([
                    prisma.refreshTokens.update({
                        where: { id_refreshToken: storedToken.id_refreshToken },
                        data: { usado: true }
                    }),
                    prisma.refreshTokens.create({
                        data:{
                            token: refreshToken,
                            id_conta_fk: decodedToken.id_conta,
                            expiracao: newExpireDate,
                            usado: false
                        }
                    })
                ]) 
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
                }) 
    
                return res.status(200).json({ 
                    success: true,
                    accessToken: newAccessToken
                }) 
                
            } catch (error: any) {
                console.error("Erro no refresh token:", error) 
    
                if (error.name === "TokenExpiredError") {
                    return res.status(401).json({ 
                        success: false, 
                        message: "Sessão expirada" 
                    }) 
                }
    
                if (error.name === "JsonWebTokenError") {
                    return res.status(401).json({ 
                        success: false,
                        message: "Sessão inválida" 
                    }) 
                }
    
                return res.status(500).json({
                    success: false,
                    message: "Ocorreu um erro, tente novamente."
                }) 
            }
        }
    
}