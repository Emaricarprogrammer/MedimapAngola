import {Request, Response, Router} from "express"
import SearchDepositsController from '../../Controllers/DepositController/SearchDeposits/FindDeposits'
import { RequestsMedicineController } from "../../Controllers/DepositController/Requests/requests"
import { PharmacyOrders } from "../../Controllers/PharmacyController/getOrderDatails"
import { AuthenticationController} from '../../Controllers/AuthenticationController/Auth'
import { GetDepositController } from "../../Controllers/PharmacyController/getDeposit"

const PharmacyRoute: Router = Router();

PharmacyRoute.route("/search_deposits").get(AuthenticationController.Authentication,AuthenticationController.PharmacyAuthentication,(req: Request, res: Response) => {SearchDepositsController.search(req, res)})
PharmacyRoute.route("/deposit/:id_deposito").get((req: Request, res: Response) =>{GetDepositController.getDeposit(req, res)})
PharmacyRoute.route("/request").post(AuthenticationController.Authentication,AuthenticationController.PharmacyAuthentication,(req: Request, res: Response) =>{RequestsMedicineController.request(req, res)})
PharmacyRoute.route("/my/requests/:id_farmacia").get(AuthenticationController.Authentication,AuthenticationController.PharmacyAuthentication,(req: Request, res: Response) => {PharmacyOrders.getOrders(req, res)})

export {PharmacyRoute}