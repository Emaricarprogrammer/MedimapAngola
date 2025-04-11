import {Request, Response, Router} from "express"
import { LoginEntity } from "../Controllers/LoginEntitiesControllers.ts/LoginEntities"
import {ForgotPasswordController} from "../Controllers/ForgotPassowordController/ForgotPassword"
import RefreshTokenController from "../Controllers/AuthenticationController/refreshtoken"
import { loginLimiter } from "../Utils/Limiters/loginLimit"

const GeneralRoute: Router = Router();

GeneralRoute.route("/auth/login").post((req: Request, res: Response) => {LoginEntity.LoginEntities(req, res)})
GeneralRoute.route("/auth/logout").post((req: Request, res: Response) => {LoginEntity.Logout(req, res)})
GeneralRoute.route("/auth/refreshToken").post((req: Request, res: Response) => {RefreshTokenController.refreshToken(req, res)})
GeneralRoute.route("/auth/forgot_password").post((req: Request, res: Response) => {ForgotPasswordController.ForgotPassword(req, res)})
GeneralRoute.route("/auth/reset_password").post((req: Request, res: Response) => {ForgotPasswordController.ResetPassword(req, res)})

export default GeneralRoute
