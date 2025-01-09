"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmtpConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.SmtpConfig = {
    host: "smtp.gmail.com",
    port: 587,
    user: "noreplaymedimapangola@gmail.com",
    pass: process.env.PASS
};
