import dotenv from "dotenv"
import twilio from "twilio"
dotenv.config()

const configurationTwilioClient = {
    accountSid: process.env.TWILIO_SDI,
    authToken: process.env.TWILIO_TOKEN,
    twilioNumber: process.env.TWILIO_NUMBER
}
const twilioClient = new twilio.Twilio(configurationTwilioClient.accountSid, configurationTwilioClient.authToken)

export{twilioClient}