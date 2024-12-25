"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLoginService = void 0;
const validators_1 = require("../../Utils/Validators/validators/validators");
class AdminLoginService {
    constructor(adminLoginRepository) {
        this.adminLoginRepository = adminLoginRepository;
    }
    async AdminLogin(adminDatas) {
        try {
            if (!adminDatas) {
                throw new Error("Por favor, preencha todos os campos");
            }
            validators_1.ValidatorProps.validateEmail(adminDatas.email);
            const login = this.adminLoginRepository.login(adminDatas);
            return { login };
        }
        catch (error) {
            console.error("Erro ao fazer login: ", error.message);
            throw new Error(error.message || "Erro inesperado ao atualizar administrador.");
        }
    }
}
exports.AdminLoginService = AdminLoginService;
