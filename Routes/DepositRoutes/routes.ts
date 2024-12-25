import { Request, Response, Router } from "express";
import { CreateMedicineController } from "../../Controllers/DepositController/CreateMedicineController";
const DepositRouter: Router = Router()
DepositRouter.route("/medicamentos").post((req:Request, res:Response) => {CreateMedicineController.CreateMedicine(req, res)})
export default DepositRouter