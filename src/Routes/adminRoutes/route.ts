import { Request, Response, Router, response } from 'express' 
import CreateAccountAdminController from "../../Controllers/AdminController/Admin/CreateAccountAdmincontroller" 
import FindAdminController from "../../Controllers/AdminController/Admin/FindAdminController" 
import {FindAllAdminsController} from "../../Controllers/AdminController/Admin/FindAllAdminsController"
import { UpdateAdminAccountController } from "../../Controllers/AdminController/Admin/UpdateAdminAccountController" 
import { DeleteAdminController } from "../../Controllers/AdminController/Admin/DeleteAdminAccountController" 
import { AuthenticationController } from '../../Controllers/AuthenticationController/Auth' 
import { UsersMagementController } from '../../Controllers/AdminController/AppController/UsersControllers/UsersController'
import DeleteEntityController from "../../Controllers/EntityController/DeleteEntity"

const AdminRouter: Router = Router()
/**
 * Publics Routes
 */
AdminRouter.route("/signup").post((req: Request, res: Response) => {CreateAccountAdminController.CreateAdminAccount(req, res)})

/**
 * Private Routes
 */ 
AdminRouter.route("/:id_admin").get(AuthenticationController.Authentication,AuthenticationController.AdminAuthentication,(req:Request, res:Response) => {FindAdminController.findAdmin(req, res)})
AdminRouter.route("/:id_admin").delete(AuthenticationController.Authentication,AuthenticationController.AdminAuthentication,(req: Request, res: Response) => {DeleteAdminController.DeleteAdmin(req, res)})
AdminRouter.route("/all/admins").get(AuthenticationController.Authentication,AuthenticationController.AdminAuthentication,( req: Request, res: Response) => {FindAllAdminsController.findAllAdmin(req, res)})
AdminRouter.route("/:id_admin").patch(AuthenticationController.Authentication,AuthenticationController.AdminAuthentication,(req:Request, res:Response) => {UpdateAdminAccountController.updateAdminAccount(req, res)})
AdminRouter.route("/appControll/users").get(AuthenticationController.Authentication,AuthenticationController.AdminAuthentication,(req: Request, res: Response) => {UsersMagementController.CountUsers(req, res)})
AdminRouter.route("/appControll/all/users").get(AuthenticationController.Authentication,AuthenticationController.AdminAuthentication,(req: Request, res: Response) => {UsersMagementController.AllEntities(req, res)})
AdminRouter.route("/appControll/delete/users").delete(AuthenticationController.Authentication,AuthenticationController.AdminAuthentication,(req: Request, res: Response) => {UsersMagementController.DeleteAllAccountsEntities(req, res)})
AdminRouter.route("/appControll/delete/:id_entidade").delete(AuthenticationController.Authentication,AuthenticationController.AdminAuthentication,(req: Request, res: Response) => {DeleteEntityController.deleteEntity(req, res)})


export default AdminRouter
