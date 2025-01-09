"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_1 = __importDefault(require("./Routes/adminRoutes/route"));
const routes_1 = __importDefault(require("./Routes/DepositRoutes/routes"));
const routes_2 = __importDefault(require("./Routes/routes"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const App = (0, express_1.default)();
App.use(express_1.default.json());
App.use((0, helmet_1.default)());
App.use((0, cors_1.default)());
App.use("/medimapangola.ao/admin", route_1.default);
App.use("/medimapangola.ao/deposito", routes_1.default);
App.use("/medimapangola.ao/", routes_2.default);
App.use((req, res, next) => {
    res.status(404).json({ message: "Esta página não existe" });
});
App.use((err, req, res, next) => {
    console.error("Erro interno:", err);
    res.status(500).json({ message: "Erro interno do servidor. Por favor, tente mais tarde." });
});
exports.default = App;
