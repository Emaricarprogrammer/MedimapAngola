import dotenv from "dotenv"
import {v2 as cloudinary} from "cloudinary"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || "djtbfmzkk",
    api_key: process.env.API_SECRET_KEY_CLOUDYNARY || "723733336134724",
    api_secret: process.env.API_SECRET_CLOUDYNARY || "qB-6fOFksGz8QLY_ZzVmTDIHR88",
    timeout:60000
})

export default cloudinary