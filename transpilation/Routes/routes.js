"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LoginEntities_1 = require("../Controllers/LoginEntitiesControllers.ts/LoginEntities");
const client_1 = require("@prisma/client");
const route = (0, express_1.Router)();
route.route("/sign-in").post((req, res) => { LoginEntities_1.LoginEntity.LoginEntities(req, res); });
route.route("/teste").post((req, res) => {
    const { nif, firma, tipo, id } = req.body;
    const prisma = new client_1.PrismaClient();
    const i = prisma.entidades.create({
        data: {
            NIF_entidade: 29393932222221,
            firma_entidade: "Vamos ver so e filhos",
            tipo_entidade: "deposito",
            id_conta_fk: "01b72519-c997-4772-bab0-99647ffc87d7"
        }
    });
    console.log(i.then((result) => {
        console.log(result);
    }).catch((err) => { console.log(err); }));
});
exports.default = route;
