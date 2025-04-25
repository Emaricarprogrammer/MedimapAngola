import limiter from "express-rate-limit"
import { LimiterTemplate } from "../providers/SendEmails/Templates/limiter"
import fs from "fs"
import path from "path"

const loginLimiter = limiter({
    limit: 3,
    message:"Você excedeu o seu limite de tentativas de login, por favor tente novamente dentro de 15 minutos",
    windowMs: 15 * 60 *1000,
    handler:(req, res) =>{res.status(429).send(LimiterTemplate)}
})

export {loginLimiter}