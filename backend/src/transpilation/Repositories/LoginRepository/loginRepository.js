"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const passwordService_1 = require("../../Services/PasswordService/passwordService");
const validators_1 = require("../../Utils/Validators/validators/validators");
const jwt_1 = __importDefault(require("jwt"));
class Login {
    constructor(prisma) {
        this.Prisma = prisma;
    }
    async login(loginDatas) {
        if (!loginDatas.email || !loginDatas.password) {
            throw new Error("Por favor, preencha todos os campos!");
        }
        validators_1.ValidatorProps.validateEmail(loginDatas.email);
        const existingUser = await this.Prisma.admin.findUnique({
            where: {
                email_admin: loginDatas.email
            }
        });
        if (!existingUser) {
            throw new Error("Crédenciais inválidas");
        }
        const isPasswordValid = passwordService_1.PasswordService.PasswordCompare(loginDatas.password, existingUser.password_admin);
        if (!isPasswordValid) {
            throw new Error("Crénciais inválidas");
        }
        const token = jwt_1.default.sign({
            id: existingUser.id_admin,
            email: existingUser.email_admin,
            password: existingUser.password_admin
        }, process.env.SUPER_SECRET_KEY);
        return token;
    }
}
exports.Login = Login;
