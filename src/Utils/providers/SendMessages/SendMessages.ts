import { twilioClient } from "./config"
import dotenv from "dotenv"
dotenv.config()
async function sendSMS(phoneNumber: string, message: string)
{
    console.log(phoneNumber, message)
    try
    {
        await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_NUMBER,
            to: `+244${phoneNumber}`
        })
        return {success: true, message: "Mensagem enviada com sucesso"}
    }
    catch(error)
    {
        console.error(error)
        return {success: false, message: "Ocorreu um erro ao enviar esta mensagem"}
    }
}
export {sendSMS}