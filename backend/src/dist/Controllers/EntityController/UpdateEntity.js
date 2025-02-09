"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEntityController = void 0;
const client_1 = require("@prisma/client");
const EntityRepository_1 = require("../../Repositories/EntityRepository/EntityRepository");
const validator_1 = __importDefault(require("validator"));
const validators_1 = require("../../Utils/Validators/validators/validators");
const passwordService_1 = require("../../Utils/PasswordService/passwordService");
const ContactsRepository_1 = require("../../Repositories/ContactsRepository/ContactsRepository");
const AccountRespository_1 = require("../../Repositories/AccountRepository/AccountRespository");
const AdressRepository_1 = require("../../Repositories/AdressRepository/AdressRepository");
const prisma = new client_1.PrismaClient();
const EntitiesRepositoriesInstance = new EntityRepository_1.EntitiesRepositories(prisma);
const ContactsRepositoriesInstance = new ContactsRepository_1.ContactsRepository(prisma);
const AccountRepositoriesInstance = new AccountRespository_1.AccountRepository(prisma);
const AdressRepositoriesInstance = new AdressRepository_1.AdressRepositories(prisma);
class UpdateEntityController {
    static async updateEntity(req, res) {
        try {
            const { id_entidade } = req.params;
            const { nif, firma, tipo_entidade, contacto, email, password, newPassword, logradouro, rua, numero, cidade, pais, } = req.body;
            const EntityExists = await validators_1.ValidatorProps.EntityExists(id_entidade);
            if (!EntityExists) {
                return res.status(404).json({ success: false, message: "Usuário não encontrado." });
            }
            const ContactsExists = await validators_1.ValidatorProps.NumberExists(contacto);
            const NifExists = await validators_1.ValidatorProps.NifExists(nif);
            if (!nif && !firma && !tipo_entidade && !contacto && !email && !password && !logradouro && !rua && !numero && !cidade && !pais) {
                return res.status(400).json({ success: false, message: "Informe pelo menos um campo para atualização." });
            }
            const EntityUpdateData = {};
            const AccountUpdateData = {};
            const AdressUpdateData = {};
            const ContactsUpdateData = {};
            if (nif) {
                if (NifExists) {
                    return res.status(400).json({
                        success: false,
                        message: "Oooooops! Este nif já está sendo usado, tente usar outro.",
                    });
                }
                if (!validator_1.default.isInt(nif)) {
                    return res.status(400).json({
                        success: false,
                        message: "Por favor informe um nif válido.",
                    });
                }
                EntityUpdateData.nif = nif;
            }
            if (firma) {
                EntityUpdateData.firma = firma;
            }
            if (tipo_entidade) {
                if (!["farmacia", "deposito"].includes(tipo_entidade.toLowerCase())) {
                    return res.status(400).json({ success: false, message: "Apenas aceitamos Farmácias e Depósitos." });
                }
                EntityUpdateData.tipo_entidade = tipo_entidade.toLowerCase();
            }
            if (email) {
                if (!validator_1.default.isEmail(email)) {
                    return res.status(400).json({ success: false, message: "Formato de email inválido." });
                }
                const EmailExists = await validators_1.ValidatorProps.EmailExists(email);
                if (EmailExists) {
                    return res.status(400).json({ success: false, message: "Este email já está sendo usado." });
                }
                AccountUpdateData.email = email;
            }
            if (password && newPassword) {
                const returnedDatas = await prisma.contas.findFirst({
                    where: { id_conta: EntityExists.id_conta_fk }
                });
                if (!returnedDatas) {
                    return res.status(400).json({ success: false, message: "Conta não encontrada." });
                }
                // Comparar senha atual
                const verifyPassword = await passwordService_1.PasswordService.PasswordCompare(password, returnedDatas.password);
                if (!verifyPassword) {
                    return res.status(400).json({ success: false, message: "A sua senha atual está incorreta!" });
                }
                // Validar nova senha
                const validatePassword = validators_1.ValidatorProps.validatePassword(newPassword);
                if (validatePassword == false) {
                    return res.status(400).json({
                        success: false,
                        message: "A senha deve ter pelo menos 8 caracteres, conter uma letra maiúscula, um número e um caractere especial.",
                    });
                }
                // Gerar hash da nova senha
                const hashedPassword = await passwordService_1.PasswordService.hashPassword(newPassword);
                AccountUpdateData.password = hashedPassword;
            }
            if (contacto) {
                if (ContactsExists) {
                    return res.status(400).json({ success: false, message: "O número já esta sendo usado." });
                }
                if (!validator_1.default.isInt(contacto)) {
                    return res.status(400).json({
                        success: false,
                        message: "Por favor informe um contacto válido.",
                    });
                }
                ContactsUpdateData.contacto = contacto;
            }
            if (logradouro) {
                AdressUpdateData.logradouro = logradouro;
            }
            if (rua) {
                AdressUpdateData.rua = rua;
            }
            if (cidade) {
                AdressUpdateData.cidade = cidade;
            }
            if (numero) {
                AdressUpdateData.numero = numero;
            }
            if (pais) {
                AdressUpdateData.pais = pais;
            }
            if (Object.keys(AccountUpdateData).length > 0) {
                const AccountUpdated = await AccountRepositoriesInstance.updateAccount(EntityExists.id_conta_fk, AccountUpdateData);
                if (!AccountUpdated) {
                    return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
                }
            }
            if (Object.keys(EntityUpdateData).length > 0) {
                const EntityUpdated = await EntitiesRepositoriesInstance.updateEntity(id_entidade, {
                    NIF_entidade: nif,
                    tipo_entidade: tipo_entidade,
                    firma_entidade: validator_1.default.escape(firma)
                });
                if (!EntityUpdated) {
                    return res.status(500).json({ success: false, message: "Erro ao atualizar este usúario." });
                }
            }
            if (Object.keys(ContactsUpdateData).length > 0) {
                const ContactUpdated = await ContactsRepositoriesInstance.updateContacts({ contacto: contacto, id_entidade_fk: id_entidade });
                if (!ContactUpdated) {
                    return res.status(500).json({ success: false, message: "Erro ao atualizar este contato." });
                }
            }
            if (Object.keys(AdressUpdateData).length > 0) {
                const AdressUpdated = await AdressRepositoriesInstance.updateAdress(id_entidade, AdressUpdateData);
                if (!AdressUpdated) {
                    return res.status(500).json({ success: false, message: "Erro ao atualizar este endereço." });
                }
            }
            return res.status(200).json({ success: true, message: "Atualização realizada com sucesso." });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Houve um erro interno, por favor tente novamente." });
        }
    }
}
exports.UpdateEntityController = UpdateEntityController;
