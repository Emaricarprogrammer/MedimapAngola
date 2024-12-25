import bcrypt from "bcrypt"

export class PasswordService
{
    static async hashPassword(password: string): Promise<string>
    {
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }

    static async PasswordCompare(password: string, hashedPassword: string): Promise<boolean>
    {
        return await bcrypt.compare(password, hashedPassword)
    }

}