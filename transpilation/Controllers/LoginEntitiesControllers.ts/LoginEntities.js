"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginEntity = void 0;
const AdminRepository_1 = require("../../Repositories/AdminRepository/AdminRepository");
const client_1 = require("@prisma/client");
const AccountRespository_1 = require("../../Repositories/AccountRepository/AccountRespository");
const validators_1 = require("../../Utils/Validators/validators/validators");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const AdminRepositoryInstance = new AdminRepository_1.AdminRepository(prisma);
const AccountRepositoryInstance = new AccountRespository_1.AccountRepository(prisma);
class LoginEntity {
    async LoginEntities(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: "Por favor, verifique se preencheu todos os campos" });
            }
            const AccountExists = await validators_1.ValidatorProps.EmailExists(email);
            if (!AccountExists) {
                return res.status(401).json({ success: false, message: "Email ou senha inválidos" });
            }
            const isValidPassword = await bcrypt_1.default.compare(password, AccountExists.password);
            if (!isValidPassword) {
                return res.status(401).json({ success: false, message: "Email ou senha inválido" });
            }
            let userInfo;
            let role;
            const IsAdmin = await prisma.admin.findFirst({ where: { id_conta_fk: AccountExists.id_conta } });
            if (IsAdmin) {
                role = IsAdmin.nivel_acesso === "admin" ? "admin" : "gestor";
                userInfo = {
                    id: IsAdmin.id_admin,
                    username_admin: IsAdmin.username,
                    nivel_acesso: IsAdmin.nivel_acesso
                };
            }
            else {
                const IsEntity = await prisma.entidades.findFirst({ where: { id_conta_fk: AccountExists.id_conta } });
                if (!IsEntity) {
                    return res.status(404).json({ sucess: false, message: "Estamos com problemas em encontrar a sua conta, por favor verifique as suas crédenciais" });
                }
                role = IsEntity.tipo_entidade === "farmacia" ? "farmacia" : "deposito";
                userInfo =
                    {
                        id: IsEntity.id_entidade,
                        firma_entidade: IsEntity.firma_entidade,
                        tipo_entidade: IsEntity.tipo_entidade
                    };
            }
            const token = jsonwebtoken_1.default.sign({ id_entidade: userInfo.id, role, ...userInfo }, process.env.SUPER_SECRET_KEY);
            return res.status(200).json({ logged: true, token, reponse: userInfo });
        }
        catch (error) {
            console.error("Houve um erro: ", error.message);
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
        }
    }
}
exports.LoginEntity = LoginEntity;
