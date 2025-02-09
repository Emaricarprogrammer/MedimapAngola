"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CreateAccountAdmincontroller_1 = __importDefault(require("../../Controllers/AdminController/Admin/CreateAccountAdmincontroller"));
const FindAdminController_1 = __importDefault(require("../../Controllers/AdminController/Admin/FindAdminController"));
const FindAllAdminsController_1 = require("../../Controllers/AdminController/Admin/FindAllAdminsController");
const UpdateAdminAccountController_1 = require("../../Controllers/AdminController/Admin/UpdateAdminAccountController");
const DeleteAdminAccountController_1 = require("../../Controllers/AdminController/Admin/DeleteAdminAccountController");
const Auth_1 = require("../../Controllers/AuthenticationController/Auth");
const UsersController_1 = require("../../Controllers/AdminController/AppController/UsersControllers/UsersController");
const AdminRouter = (0, express_1.Router)();
/**
 * Publics Routes
 */
AdminRouter.route("/signup").post((req, res) => { CreateAccountAdmincontroller_1.default.CreateAdminAccount(req, res); });
AdminRouter.route("/:id_admin").post((req, res) => { FindAdminController_1.default.findAdmin(req, res); });
/**
 * Private Routes
 */
AdminRouter.route("/admins").get(Auth_1.AuthenticationController.Authentication, (req, res) => { FindAllAdminsController_1.FindAllAdminsController.findAllAdmin(req, res); });
AdminRouter.route("/:id_admin").delete((req, res) => { DeleteAdminAccountController_1.DeleteAdminController.DeleteAdmin(req, res); });
AdminRouter.route("/:id_admin").patch((req, res) => { UpdateAdminAccountController_1.UpdateAdminAccountController.updateAdminAccount(req, res); });
AdminRouter.route("/private/appUsuarios").get((req, res) => { UsersController_1.UsersMagementController.CountUsers(req, res); });
exports.default = AdminRouter;
