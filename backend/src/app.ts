import express, { Request, Response, NextFunction } from "express"
import AdminRouter from "./Routes/adminRoutes/route"
import DepositRouter from "./Routes/DepositRoutes/routes"
import route from "./Routes/routes"
import helmet from "helmet"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const App = express()

App.use(express.json())
App.use(helmet())
App.use(cors())

App.use("/medimapangola.ao/admin", AdminRouter)
App.use("/medimapangola.ao/deposito", DepositRouter)
App.use("/medimapangola.ao/", route)
App.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Esta página não existe" })
})

App.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Erro interno:", err)
  res.status(500).json({ message: "Erro interno do servidor. Por favor, tente mais tarde." })
})
export default App