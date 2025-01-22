import {Request, Response, Router} from "express"
import { LoginEntity } from "../Controllers/LoginEntitiesControllers.ts/LoginEntities";
import {ForgotPasswordController} from "../Controllers/ForgotPassowordController/ForgotPassword"

const route: Router = Router();

route.route("/login").post((req: Request, res: Response) => {LoginEntity.LoginEntities(req, res)})
route.route("/forgot_password").post((req: Request, res: Response) => {ForgotPasswordController.ForgotPassword(req, res)})
route.route("/reset_password").post((req: Request, res: Response) => {ForgotPasswordController.ResetPassword(req, res)})

export default route
