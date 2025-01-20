"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AuthenticationController {
    static async Authentication(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                console.log("Token nao fornecido");
                return res.status(404).json({ success: false, message: "Oooops! Estamos tentando resolver este problema, por favor tente novamente" });
            }
            const decodedToken = await jsonwebtoken_1.default.verify(token, process.env.SUPER_SECRET_KEY);
            req.body.user = decodedToken;
            console.log(decodedToken);
            next();
        }
        catch (error) {
            return res.status(401).json({ success: false, message: "Ooooops! Parece que você não tem autorização para acessar esta página." });
        }
    }
}
exports.AuthenticationController = AuthenticationController;
