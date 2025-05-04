import { Request, Response, Router } from "express" 
import { CreateMedicineController } from "../../Controllers/DepositController/Medicines/CreateMedicine" 
import { FindMedicineController } from "../../Controllers/DepositController/Medicines/FindMedicine" 
import { FindAllMedicinesController } from "../../Controllers/DepositController/Medicines/FindAllMedicines" 
import { UpdateMedicineController } from "../../Controllers/DepositController/Medicines/UpdateMedicineController" 
import { DeleteMedicineController } from "../../Controllers/DepositController/Medicines/DeleteMedicine" 
import { AuthenticationController } from '../../Controllers/AuthenticationController/Auth' 
import { DepositsOrders } from "../../Controllers/DepositController/Requests/orders"
import {upload} from "../../Utils/providers/UploadConfig"
import { FindAllMyMedicinesController } from "../../Controllers/DepositController/Medicines/FindMyMedicines"
import { FindEntityController } from "../../Controllers/EntityController/FindEntity"
import { GetMyDatasController } from "../../Controllers/DepositController/getMyDatas"
const DepositRouter: Router = Router()

/**
 * Publics Routes
 */
DepositRouter.route("/medicines").get((req:Request, res:Response) => {FindAllMedicinesController.FindMedicines(req, res)})

/**
 * Private Routes
 */
DepositRouter.route("/medicines").post(AuthenticationController.Authentication,AuthenticationController.DepositAuthentication, upload.single("imagem"),(req:Request, res:Response) => {CreateMedicineController.CreateMedicine(req, res)})
DepositRouter.route("/medicine/:nome_generico").get((req:Request, res:Response) => {FindMedicineController.FindMedicine(req, res)})
DepositRouter.route("/medicine/:id_medicamento").patch(AuthenticationController.Authentication,AuthenticationController.DepositAuthentication,(req:Request, res:Response) => {UpdateMedicineController.UpdateMedicine(req, res)})
DepositRouter.route("/medicine/:id_medicamento").delete(AuthenticationController.Authentication,AuthenticationController.DepositAuthentication,(req: Request, res: Response) => {DeleteMedicineController.DeleteMedicine(req, res)})
DepositRouter.route("/medicines/my/requests/:id_deposito").get(AuthenticationController.Authentication,AuthenticationController.DepositAuthentication,(req: Request, res: Response) => {DepositsOrders.getOrders(req, res)})
DepositRouter.route("/myMedicines/:id_deposito").get(AuthenticationController.Authentication,AuthenticationController.DepositAuthentication,(req: Request, res: Response) => {FindAllMyMedicinesController.FindMedicines(req, res)})
DepositRouter.route("/medicines/requests/:id_aquisicao/status").patch(AuthenticationController.Authentication,AuthenticationController.DepositAuthentication,(req: Request, res: Response) => {DepositsOrders.OrdersStatus(req, res)})
DepositRouter.route("/myDatas/:id_deposito").get(AuthenticationController.Authentication,AuthenticationController.DepositAuthentication,(req: Request, res: Response) =>{GetMyDatasController.getMyDatas(req, res)})

export default DepositRouter