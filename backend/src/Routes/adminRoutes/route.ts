import { Request, Response, Router, response } from 'express';
import CreateAccountAdminController from "../../Controllers/AdminController/Admin/CreateAccountAdmincontroller";
import FindAdminController from "../../Controllers/AdminController/Admin/FindAdminController";
import {FindAllAdminsController} from "../../Controllers/AdminController/Admin/FindAllAdminsController"
import { UpdateAdminAccountController } from "../../Controllers/AdminController/Admin/UpdateAdminAccountController";
import { DeleteAdminController } from "../../Controllers/AdminController/Admin/DeleteAdminAccountController";
import { AuthenticationController } from '../../Controllers/AuthenticationController/Auth';
import { UsersMagementController } from '../../Controllers/AdminController/AppController/UsersControllers/UsersController';

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
AdminRouter.route("/:id_admin").delete((req: Request, res: Response) => {DeleteAdminController.DeleteAdmin(req, res)})
AdminRouter.route("/:id_admin").put(AuthenticationController.Authentication, (req:Request, res:Response) => {UpdateAdminAccountController.updateAdminAccount(req, res)})
AdminRouter.route("/private/appUsuarios").get((req: Request, res: Response) => {UsersMagementController.CountUsers(req, res)})

export default AdminRouter;
