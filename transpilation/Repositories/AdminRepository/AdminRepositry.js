"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const client_1 = require("@prisma/client");
class AdminRepository {
    constructor(prisma) {
        this.Prisma = prisma;
    }
    async findByEmail(email) {
        const results = await this.Prisma.admin.findUnique({
            where: { email_admin: email }
        });
        return results || null;
    }
    async createAdmin(adminDatas) {
        try {
            const adminCreated = await this.Prisma.admin.create({
                data: {
                    id_admin: adminDatas.id_admin,
                    username_admin: adminDatas.username_admin,
                    email_admin: adminDatas.email_admin,
                    password_admin: adminDatas.password_admin,
                    createdAt: adminDatas.createdAt,
                    updatedAt: adminDatas.updatedAt,
                },
            });
            return adminCreated;
        }
        catch (error) {
            console.error('Erro ao criar Admin: ', error);
            throw error;
        }
    }
}
exports.AdminRepository = AdminRepository;
const Prisma = new client_1.PrismaClient();
const t = new AdminRepository(Prisma);
t.findByEmail("emanuelantonio@gmail.com");
