import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

if (!process.env.ACCESS_JWT_SECRET || !process.env.REFRESH_JWT_SECRET) {
    throw new Error("As variáveis de ambiente ACCESS_SECRET e REFRESH_SECRET devem ser definidas.");
}

const jwtSecretKey = {
    ACCESS_SECRET: process.env.ACCESS_JWT_SECRET as string,
    REFRESH_SECRET: process.env.REFRESH_JWT_SECRET as string
}

export {jwtSecretKey}