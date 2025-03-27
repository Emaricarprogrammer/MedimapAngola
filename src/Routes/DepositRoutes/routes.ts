import { Request, Response, Router } from "express" 
import { CreateMedicineController } from "../../Controllers/DepositController/Medicines/CreateMedicine" 
import { FindMedicineController } from "../../Controllers/DepositController/Medicines/FindMedicine" 
import { FindAllMedicinesController } from "../../Controllers/DepositController/Medicines/FindAllMedicines" 
import { UpdateMedicineController } from "../../Controllers/DepositController/Medicines/UpdateMedicineController" 
import { DeleteMedicineController } from "../../Controllers/DepositController/Medicines/DeleteMedicine" 
import { AuthenticationController } from '../../Controllers/AuthenticationController/Auth' 
import { DepositsOrders } from "../../Controllers/DepositController/Requests/orders"
import {upload} from "../../Utils/providers/UploadConfig"

const DepositRouter: Router = Router()

/**
 * Publics Routes
 */
DepositRouter.route("/medicamentos").get((req:Request, res:Response) => {FindAllMedicinesController.FindMedicines(req, res)})

/**
 * Private Routes
 */
DepositRouter.route("/medicamentos").post(upload.single("imagem"),(req:Request, res:Response) => {CreateMedicineController.CreateMedicine(req, res)})
DepositRouter.route("/medicamento/:nome_comercial").post(AuthenticationController.Authentication,AuthenticationController.DepositAuthentication,(req:Request, res:Response) => {FindMedicineController.FindMedicine(req, res)})
DepositRouter.route("/medicamentos/:id_medicamento").patch(AuthenticationController.Authentication,AuthenticationController.DepositAuthentication,(req:Request, res:Response) => {UpdateMedicineController.UpdateMedicine(req, res)})
DepositRouter.route("/medicamento/:id_medicamento").delete(AuthenticationController.Authentication,AuthenticationController.DepositAuthentication,(req: Request, res: Response) => {DeleteMedicineController.DeleteMedicine(req, res)})
DepositRouter.route("/medicamentos/pedidos").get((req: Request, res: Response) => {DepositsOrders.getOrders(req, res)})
DepositRouter.route("/medicamentos/pedidos/:id_aquisicao/status").patch((req: Request, res: Response) => {DepositsOrders.OrdersStatus(req, res)})
export default DepositRouter