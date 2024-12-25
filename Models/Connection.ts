import { PrismaClient } from "@prisma/client";
class PrismaConnection
{
        connect = function()
        {
            return new PrismaClient()
        }
}
export default new PrismaConnection()