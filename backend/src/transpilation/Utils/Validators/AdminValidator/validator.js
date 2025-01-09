"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatiorAdmin = void 0;
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
class ValidatiorAdmin {
    static ValidateCreateAdmin() {
        return [
            (0, express_validator_1.body)("username_admin").notEmpty().withMessage("Informe o nome de úsuario")
                .isLength({ min: 3 }).withMessage("O nome de úsuario precisa ter mais de 3 caracteres"),
            (0, express_validator_1.body)('email_admin').isEmail().withMessage('Email inválido')
                .custom(async (value) => {
                const prisma = new client_1.PrismaClient();
                const userExists = await prisma.admin.count({ where: { email_admin: value } });
                if (userExists) {
                    throw new Error('Este já em uso cadastrado');
                }
                prisma.$disconnect();
                return true;
            })
                .normalizeEmail(),
            (0, express_validator_1.body)('password_admin').notEmpty().withMessage('Informe a sua senha').isLength({ min: 8 }).withMessage('A senha deve ter pelo menos 8 caracteres')
                .matches(/\d/).withMessage('A senha deve conter pelo menos um número')
                .matches(/[A-Z]/).withMessage('A senha deve conter pelo menos uma letra')
                .matches(/[!@#$%^&*(),.?:{}|<>]/).withMessage('A senha deve conter pelo menos um caracter especial')
        ];
    }
}
exports.ValidatiorAdmin = ValidatiorAdmin;
