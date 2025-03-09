import limiter from "express-rate-limit"

const loginLimiter = limiter({
    limit: 3,
    message:"Você excedeu o seu limite de tentativas de login, por favor tente novamente dentro de 15 minutos",
    windowMs: 15 * 60 *1000
})

export {loginLimiter}