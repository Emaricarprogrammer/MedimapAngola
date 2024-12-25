"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Admincontroller_1 = __importDefault(require("../Controllers/AdminController/Admincontroller"));
const router = (0, express_1.Router)();
const adminController = new Admincontroller_1.default();
router.route("/").get((req, res) => {
    res.send("API online");
});
router.route("/admin/auth/signup").post((req, res) => { adminController.CreateAdminAccount(req, res); });
router.route("/admin/:email_admin").post((req, res) => { adminController.FindByAdminByEmail(req, res); });
router.route("/admin/me/:id_admin").post((req, res) => { adminController.FindAdmin(req, res); });
router.route("/admin/me/edit/:id_admin").put((req, res) => { adminController.UpdateAdmin(req, res); });
exports.default = router;
