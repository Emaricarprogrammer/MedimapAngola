import dotenv from "dotenv"
dotenv.config();

export const SmtpConfig = 
{
    host: "smtp.gmail.com",
    port:  587,
    user:  "noreplaymedimapangola@gmail.com",
    pass: process.env.PASS
    
}