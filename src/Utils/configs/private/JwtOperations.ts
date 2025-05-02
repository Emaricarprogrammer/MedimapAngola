import jwt from "jsonwebtoken";
import { jwtSecretKey } from "./secreteKey"
import dotenv from "dotenv"
dotenv.config()

class JwtOperation {
    static generateToken(payload: Record<string, any>): string {
        return jwt.sign(payload, jwtSecretKey.ACCESS_SECRET, {expiresIn: "7d"});
    }

    static generateRefreshToken(payload: Record<string, any>): string {
        return jwt.sign(payload, jwtSecretKey.REFRESH_SECRET, {expiresIn: "7d"});
    }

    static verifyToken(token: string, jwtSecretKey: string)
    {
        return jwt.verify(token, jwtSecretKey) as Record<string, any>
    }
}
export { JwtOperation };
