import { Request, Response, Router } from "express";
import { CreateMedicineController } from "../../Controllers/DepositController/Medicines/CreateMedicine";
import { FindMedicineController } from "../../Controllers/DepositController/Medicines/FindMedicine";
import { FindAllMedicinesController } from "../../Controllers/DepositController/Medicines/FindAllMedicines";
import { UpdateMedicineController } from "../../Controllers/DepositController/Medicines/UpdateMedicineController";
import { DeleteMedicineController } from "../../Controllers/DepositController/Medicines/DeleteMedicine";

const DepositRouter: Router = Router()

DepositRouter.route("/medicamentos").post((req:Request, res:Response) => {CreateMedicineController.CreateMedicine(req, res)})
DepositRouter.route("/medicamento/:nome_comercial").post((req:Request, res:Response) => {FindMedicineController.FindMedicine(req, res)})
DepositRouter.route("/medicamentos").get((req:Request, res:Response) => {FindAllMedicinesController.FindMedicines(req, res)})
DepositRouter.route("/medicamentos/:id_medicamento").patch((req:Request, res:Response) => {UpdateMedicineController.UpdateMedicine(req, res)})
DepositRouter.route("/medicamento/:id_medicamento").delete((req: Request, res: Response) => {DeleteMedicineController.DeleteMedicine(req, res)})

export default DepositRouter