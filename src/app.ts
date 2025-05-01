import express, {Request, Response, NextFunction} from "express"
import AdminRouter from "./Routes/adminRoutes/route"
import DepositRouter from "./Routes/DepositRoutes/routes"
import { PharmacyRoute } from "./Routes/PharmacyRoutes/routes"
import GeneralRoute from "./Routes/routes"
import helmet from "helmet"
import cors from "cors"
import dotenv from "dotenv"
import EntityRoute from "./Routes/EntitiesRoutes/routes"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import fs from "fs"
import path from "path"
dotenv.config()

const App = express()
const allowdDomains = ["http://localhost:5173", "*", 'file://']    

App.use(express.json())
App.use(cookieParser())
App.use(helmet())
/*
App.use(morgan("combined", {
  stream: fs.createWriteStream(
    path.join(__dirname, 'access_logs'), { flags: 'a' }
  )
}));

if (process.env.NODE_ENV === "production") {
  console.log = (...args) => {
    const message = `${new Date().toISOString()} - ${args.join(' ')}\n`;
    try {
      fs.appendFileSync(path.join(__dirname, 'app.log'), message);
    } catch (err){
      console.error("Erro ao escrever no log:", err);
    }
  } 
}
*/
App.use(cors({ 
  origin: ['http://localhost:5173', 'http://192.168.188.103:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed methods
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
}))

App.use("/medmapangola.ao/admin", AdminRouter)
App.use("/medmapangola.ao/entity/deposit", DepositRouter)
App.use("/medmapangola.ao/entity/pharmacy", PharmacyRoute)
App.use("/medmapangola.ao/entities", EntityRoute)
App.use("/medmapangola.ao", GeneralRoute)

App.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Esta página não existe" })
})

App.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Erro interno:", err);
  res.status(500).json({
    message: "Estamos tentando resolver este problema. Por favor, tente mais tarde ou contacte o suporte.",});
});

export default App