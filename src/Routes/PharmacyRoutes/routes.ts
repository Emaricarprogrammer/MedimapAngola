import {Request, Response, Router} from "express"
import SearchDepositsController from '../../Controllers/DepositController/SearchDeposits/FindDeposits'
import { RequestsMedicineController } from "../../Controllers/DepositController/Requests/requests"
import { PharmacyOrders } from "../../Controllers/PharmacyController/getOrderDatails";

const PharmacyRoute: Router = Router();

PharmacyRoute.route("/depoitos_proximos").get((req: Request, res: Response) => {SearchDepositsController.search(req, res)})
PharmacyRoute.route("/pedido").post((req: Request, res: Response) =>{RequestsMedicineController.request(req, res)})
PharmacyRoute.route("/pedidos/:id_farmacia").get((req: Request, res: Response) => {PharmacyOrders.getOrders(req, res)})


export {PharmacyRoute}