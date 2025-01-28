"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EntityController_1 = __importDefault(require("../../Controllers/EntityController/EntityController"));
const RouteEntity = (0, express_1.Router)();
RouteEntity.route("/signup").post((req, res) => { EntityController_1.default.CreateEntityAccount(req, res); });
RouteEntity.route("/:id_entity").post((req, res) => { EntityController_1.default.FindEntity(req, res); });
RouteEntity.route("/edit/:id_entity").put((req, res) => { EntityController_1.default.UpdateEntity(req, res); });
RouteEntity.route("/delete/:id_entity/:id_conta_fk").delete((req, res) => { EntityController_1.default.DeleteEntity(req, res); });
exports.default = RouteEntity;
