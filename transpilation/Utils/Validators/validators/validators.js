"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorProps = void 0;
const client_1 = require("@prisma/client");
const validator_1 = __importDefault(require("validator"));
const express_1 = require("express");
const prisma = new client_1.PrismaClient();
class ValidatorProps {
    static validateEmail(email) {
        if (!email) {
            return express_1.response.status(400).json({ success: false, message: "Invalid email" });
        }
        if (!validator_1.default.isEmail(email)) {
            return express_1.response.status(400).json({ success: false, message: "Invalid email" });
        }
        return true;
    }
    static validatePassword(password) {
        const RegexPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!RegexPassword.test(password)) {
            return false;
        }
    }
    static EmailExists(email) {
        const verify = prisma.contas.findUnique({ where: { email: email } });
        return verify;
    }
    static IsVAlidEmail(email) {
        validator_1.default.isEmail(email);
    }
    static AdminExists(id_admin) {
        const verify = prisma.admin.findUnique({ where: { id_admin: id_admin } });
        return verify;
    }
    static sanitizeInput(username, email, password, nivel_acesso) {
        let InputSanitazed = {
            username_sanitized: validator_1.default.escape(validator_1.default.trim(username)),
            nivel_acesso_sanitized: validator_1.default.escape(validator_1.default.trim(nivel_acesso)),
            email_sanitized: validator_1.default.normalizeEmail(email),
            password_sanitized: validator_1.default.escape(validator_1.default.trim(password))
        };
        return InputSanitazed;
    }
}
exports.ValidatorProps = ValidatorProps;
