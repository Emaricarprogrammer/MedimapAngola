"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CreateEntity_1 = require("../../Controllers/EntityController/CreateEntity");
const UpdateEntity_1 = require("../../Controllers/EntityController/UpdateEntity");
const DeleteEntity_1 = __importDefault(require("../../Controllers/EntityController/DeleteEntity"));
const EntityRoute = (0, express_1.Router)();
EntityRoute.route("/signup").post((req, res) => { CreateEntity_1.CreateEntityController.create(req, res); });
EntityRoute.route("/:id_entidade").patch((req, res) => { UpdateEntity_1.UpdateEntityController.updateEntity(req, res); });
EntityRoute.route("/:id_entidade").delete((req, res) => { DeleteEntity_1.default.deleteEntity(req, res); });
exports.default = EntityRoute;
