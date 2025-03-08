import {Request, Response, Router} from "express"
import SearchDepositsController from '../../Controllers/DepositController/SearchDeposits/FindDeposits'

const PharmacyRoute: Router = Router();

PharmacyRoute.route("/").get((req: Request, res: Response) => {SearchDepositsController.search(req, res)})

export {PharmacyRoute}