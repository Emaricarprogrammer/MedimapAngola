"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LoginEntities_1 = require("../Controllers/LoginEntitiesControllers.ts/LoginEntities");
const route = (0, express_1.Router)();
const Login = new LoginEntities_1.LoginEntity();
route.route("/sign-in").post((req, res) => { Login.LoginEntities(req, res); });
exports.default = route;
