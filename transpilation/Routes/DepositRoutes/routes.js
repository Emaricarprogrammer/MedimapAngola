"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CreateMedicineController_1 = require("../../Controllers/DepositController/CreateMedicineController");
const DepositRouter = (0, express_1.Router)();
DepositRouter.route("/medicamentos").post((req, res) => { CreateMedicineController_1.CreateMedicineController.CreateMedicine(req, res); });
exports.default = DepositRouter;
