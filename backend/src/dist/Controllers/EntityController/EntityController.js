"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EntityRepository_1 = require("../../Repositories/EntityRepository/EntityRepository");
const client_1 = require("@prisma/client");
const Prisma = new client_1.PrismaClient();
const EntityRepositoryInstance = new EntityRepository_1.EntityRepository(Prisma);
class EntityController {
    static async CreateEntityAccount(req, res) {
        try {
            const newEntity = await EntityRepositoryInstance.createEntity(req);
            return res.status(201).json({ success: true, message: "Entidade criada com sucesso", response: newEntity });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            return res.status(500).json({
                success: false,
                message: 'Erro ao criar entidde',
                error: error
            });
        }
    }
    static async FindEntity(req, res) {
        try {
            const results = await EntityRepositoryInstance.findEntity(req);
            return res.status(200).json({ success: true, response: results });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            return res.status(500).json({
                success: false,
                message: error
            });
        }
    }
    static async UpdateEntity(req, res) {
        try {
            const results = await EntityRepositoryInstance.updateEntity(req);
            return res.status(200).json({ success: true, message: "Dados actualizados com sucesso!", response: results });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            console.error(error);
            return res.status(500).json({ message: error });
        }
    }
    static async DeleteEntity(req, res) {
        try {
            const results = await EntityRepositoryInstance.deleteEntity(req);
            return res.status(200).json({ success: true, message: "Entidade eliminada com sucesso!" });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ message: error });
        }
    }
}
exports.default = EntityController;
