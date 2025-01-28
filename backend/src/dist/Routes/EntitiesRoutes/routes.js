"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CreateEntity_1 = require("../../Controllers/EntityController/CreateEntity");
const EntityRoute = (0, express_1.Router)();
EntityRoute.route("/signup").post((req, res) => { CreateEntity_1.CreateEntityController.create(req, res); });
exports.default = EntityRoute;
