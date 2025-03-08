import express, { Request, Response, NextFunction } from "express"
import AdminRouter from "./Routes/adminRoutes/route"
import DepositRouter from "./Routes/DepositRoutes/routes"
import { PharmacyRoute } from "./Routes/PharmacyRoutes/routes"
import route from "./Routes/routes"
import helmet from "helmet"
import cors from "cors"
import dotenv from "dotenv"
import EntityRoute from "./Routes/EntitiesRoutes/routes"
import cookieParser from "cookie-parser"

dotenv.config()

const App = express()

App.use(express.json())
App.use(cookieParser())
App.use(helmet())
App.use(cors({
  origin:"http://localhost:3000",
  credentials: true,
}))

App.use("/medimapangola.ao/admin", AdminRouter)
App.use("/medimapangola.ao/entidade/deposito", DepositRouter)
App.use("/medimapangola.ao/entidade/farmacia", PharmacyRoute)
App.use("/medimapangola.ao/entidades", EntityRoute)
App.use("/medimapangola.ao", route)

App.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Esta página não existe" })
})

App.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Erro interno:", err)
  res.status(500).json({ message: "Erro interno do servidor. Por favor, tente mais tarde." })
})
export default App