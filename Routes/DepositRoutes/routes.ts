import { Request, Response, Router } from "express";
import { CreateMedicineController } from "../../Controllers/DepositController/Medicines/CreateMedicine";
import { FindMedicineController } from "../../Controllers/DepositController/Medicines/FindMedicine";
import { FindAllMedicinesController } from "../../Controllers/DepositController/Medicines/FindAllMedicines";


const DepositRouter: Router = Router()
DepositRouter.route("/medicamentos").post((req:Request, res:Response) => {CreateMedicineController.CreateMedicine(req, res)})
DepositRouter.route("/medicamento/:nome_comercial").post((req:Request, res:Response) => {FindMedicineController.FindMedicine(req, res)})
DepositRouter.route("/medicamentos").get((req:Request, res:Response) => {FindAllMedicinesController.FindMedicines(req, res)})
export default DepositRouter