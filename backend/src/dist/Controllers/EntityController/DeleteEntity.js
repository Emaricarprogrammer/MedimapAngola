"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const validators_1 = require("../../Utils/Validators/validators/validators");
const AccountRespository_1 = require("../../Repositories/AccountRepository/AccountRespository");
const EntityRepository_1 = require("../../Repositories/EntityRepository/EntityRepository");
const ContactsRepository_1 = require("../../Repositories/ContactsRepository/ContactsRepository");
const AdressRepository_1 = require("../../Repositories/AdressRepository/AdressRepository");
const GeolocationRepository_1 = require("../../Repositories/GeolocationRepository/GeolocationRepository");
const prisma = new client_1.PrismaClient();
const AccountRepositoryInstance = new AccountRespository_1.AccountRepository(prisma);
const EntitiesRepositoryInstance = new EntityRepository_1.EntitiesRepositories(prisma);
const ContactsRepositoryInstance = new ContactsRepository_1.ContactsRepository(prisma);
const AdressRepositoryInstance = new AdressRepository_1.AdressRepositories(prisma);
const GeolocationRepositoryInstance = new GeolocationRepository_1.GeolocationRepository(prisma);
class DeleteEntityController {
    static async deleteEntity(req, res) {
        try {
            const { id_entidade } = req.params;
            if (!id_entidade) {
                console.log("Id invalido");
                return res.status(400).json({ success: false, message: "Estamos tentando resolver este problema, por favor tente novamente." });
            }
            const EntityExists = await validators_1.ValidatorProps.EntityExists(id_entidade);
            if (!EntityExists) {
                console.log("Usuário não encontrado");
                return res.status(404).json({ success: false, message: "Ooooops! Não foi possivel encontrar este usuário, por favor tente novamente." });
            }
            await prisma.$transaction(async () => {
                await EntitiesRepositoryInstance.deleteEntity(id_entidade);
                await AccountRepositoryInstance.deleteAccount(EntityExists.id_conta_fk);
                await ContactsRepositoryInstance.deleteContact(id_entidade);
                await AdressRepositoryInstance.deleteAdress(id_entidade);
                await GeolocationRepositoryInstance.deleteGeolocation(id_entidade);
            }, { timeout: 5000 });
            return res.status(200).json({ success: true, message: "Dados deletados com sucesso" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Estamos tentando resolver este problema por favor, tente novamente mais tarde." });
        }
    }
}
exports.default = DeleteEntityController;
