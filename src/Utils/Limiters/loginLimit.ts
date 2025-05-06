import limiter from "express-rate-limit"
import { LimiterTemplate } from "../providers/SendEmails/Templates/limiter"
import fs from "fs"
import path from "path"

const loginLimiter = limiter({
    limit: 3,
    message:"Você excedeu o seu limite de tentativas de login, por favor tente novamente dentro de 10 segundos",
    windowMs: 10 * 1000,
    handler:(req, res) =>{res.status(429).json({success: false, message:"Você excedeu o seu limite de tentativas de login, por favor tente novamente dentro de 10 segundos"})}
})

export {loginLimiter}
