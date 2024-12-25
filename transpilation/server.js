"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const portURI = process.env.PORT_URI_SERVER || 5000;
const runServer = async () => {
    try {
        app_1.default.listen(portURI, () => {
            console.log(`Servidor online, ouvindo a porta: ${portURI}`);
        });
    }
    catch (error) {
        console.error("Erro ao iniciar o servidor:", error);
        process.exit(1);
    }
};
runServer();
