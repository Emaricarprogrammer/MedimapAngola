import { Request, Response, Router, response } from 'express';
import CreateAccountAdminController from "../../Controllers/AdminController/CreateAccountAdmincontroller";
import FindAdminController from "../../Controllers/AdminController/FindAdminController";
import {FindAllAdminsController} from "../../Controllers/AdminController/FindAllAdminsController"
import { UpdateAdminAccountController } from "../../Controllers/AdminController/UpdateAdminAccountController";
import { DeleteAdmin } from "../../Controllers/AdminController/DeleteAdminAccountController";

const AdminRouter: Router = Router();

const adminController = new CreateAccountAdminController();
const findadmin = new FindAdminController()
const findAllAdmins = new FindAllAdminsController()
const updateAdmin = new UpdateAdminAccountController()
const deleteAdmin = new DeleteAdmin()

AdminRouter.route("/signup").post((req: Request, res: Response) => {adminController.CreateAdminAccount(req, res);})
AdminRouter.route("/:id_admin").post((req:Request, res:Response) => {findadmin.findAdmin(req, res)})
AdminRouter.route("/admins").get((req: Request, res: Response) => {findAllAdmins.findAllAdmin(req, res)})
AdminRouter.route("/:id_admin").delete((req: Request, res: Response) => {deleteAdmin.DeleteAdminController(req, res)})
AdminRouter.route("/edit/:id_admin").put((req:Request, res:Response) => {updateAdmin.updateAdminAccount(req, res)})
export default AdminRouter;
