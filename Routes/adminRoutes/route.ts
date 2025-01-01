import { Request, Response, Router, response } from 'express';
import CreateAccountAdminController from "../../Controllers/AdminController/CreateAccountAdmincontroller";
import FindAdminController from "../../Controllers/AdminController/FindAdminController";
import {FindAllAdminsController} from "../../Controllers/AdminController/FindAllAdminsController"
import { UpdateAdminAccountController } from "../../Controllers/AdminController/UpdateAdminAccountController";
import { DeleteAdminController } from "../../Controllers/AdminController/DeleteAdminAccountController";
import { AuthenticationController } from '../../Controllers/AuthenticationController/Auth';

const AdminRouter: Router = Router();
/**
 * Publics Routes
 */
AdminRouter.route("/signup").post((req: Request, res: Response) => {CreateAccountAdminController.CreateAdminAccount(req, res);})
AdminRouter.route("/:id_admin").post((req:Request, res:Response) => {FindAdminController.findAdmin(req, res)})
/**
 * Private Routes
 */
AdminRouter.route("/admins").get(AuthenticationController.Authentication, (req: Request, res: Response) => {FindAllAdminsController.findAllAdmin(req, res)})
AdminRouter.route("/:id_admin").delete(AuthenticationController.Authentication, (req: Request, res: Response) => {DeleteAdminController.DeleteAdmin(req, res)})
AdminRouter.route("/edit/:id_admin").put(AuthenticationController.Authentication, (req:Request, res:Response) => {UpdateAdminAccountController.updateAdminAccount(req, res)})

export default AdminRouter;
