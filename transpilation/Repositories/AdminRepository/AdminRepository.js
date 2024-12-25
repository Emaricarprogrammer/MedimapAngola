"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
class AdminRepository {
    constructor(prisma) {
        this.Prisma = prisma;
    }
    async createAdmin(adminDatas) {
        const adminData = await this.Prisma.admin.create({ data: { ...adminDatas } });
        return adminData;
    }
    async findAdmin(id_admin) {
        const adminResults = await this.Prisma.admin.findUnique({
            where: { id_admin: id_admin },
            include: { credenciais_admin: true }
        });
        const AdminDatasResponse = {
            id_admin: adminResults?.id_admin,
            username: adminResults?.username,
            email: adminResults?.credenciais_admin.email,
            nivel_acesso: adminResults?.nivel_acesso,
            id_conta_fk: adminResults?.id_conta_fk,
            createdAt: adminResults?.createdAt,
            updatedAt: adminResults?.updatedAt
        };
        return AdminDatasResponse;
    }
    async findAllAdmin() {
        const AdminsResults = await this.Prisma.admin.findMany({
            include: {
                credenciais_admin: true
            }
        });
        return AdminsResults.map(admins => ({
            id_admin: admins.id_admin,
            username: admins.username,
            email: admins.credenciais_admin.email,
            nivel_acesso: admins.nivel_acesso,
            id_conta_fk: admins.id_conta_fk,
            createdAt: admins.createdAt,
            updatedAt: admins.updatedAt,
        }));
    }
    async updateAdmin(id_admin, adminData) {
        const adminUpdated = await this.Prisma.admin.update({ where: { id_admin: id_admin }, data: { ...adminData } });
        return adminUpdated;
    }
    async deleteAdmin(id_admin) {
        const adminDeleted = await this.Prisma.admin.delete({ where: { id_admin: id_admin } });
        return adminDeleted;
    }
}
exports.AdminRepository = AdminRepository;
