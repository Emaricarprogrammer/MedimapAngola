"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = require("cloudinary");
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME || "djtbfmzkk",
    api_key: process.env.API_SECRET_KEY_CLOUDYNARY || "723733336134724",
    api_secret: process.env.API_SECRET_CLOUDYNARY || "qB-6fOFksGz8QLY_ZzVmTDIHR88",
    timeout: 6000
});
exports.default = cloudinary_1.v2;
