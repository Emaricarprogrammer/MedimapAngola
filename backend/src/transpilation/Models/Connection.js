"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class PrismaConnection {
    constructor() {
        this.connect = function () {
            return new client_1.PrismaClient();
        };
    }
}
exports.default = new PrismaConnection();
