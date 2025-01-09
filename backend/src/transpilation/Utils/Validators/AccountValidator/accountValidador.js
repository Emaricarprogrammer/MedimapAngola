"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountValidators = void 0;
const AccountValidators = (req, res, next) => {
    const gestor = "gestor";
    const admin = "admin";
    const { username, email, password, nivel_acesso } = req.body;
    if (!username || !email || !password || !nivel_acesso) {
        console.log("Campos Vazios");
        return res.status(400).json({ message: MESSAGES.INVALID_INPUT });
    }
    if (nivel_acesso != gestor || nivel_acesso != admin) {
        console.log("Nivel de Acesso Invalido");
        return res.status(400).json({ message: MESSAGES.INVALID_ACCESS_LEVEL });
    }
    next();
};
exports.AccountValidators = AccountValidators;
