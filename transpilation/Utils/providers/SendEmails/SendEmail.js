"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSender = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const smtp_1 = require("../../configs/smtp");
class EmailSender {
    constructor(props) {
        this.u_text = props.text;
        this.u_subject = props.subject;
        this.u_from = props.from;
        this.u_to = props.to;
        this.u_html = props.html;
    }
    async SendEmail() {
        const transport = nodemailer_1.default.createTransport({
            host: smtp_1.SmtpConfig.host,
            port: smtp_1.SmtpConfig.port,
            secure: smtp_1.SmtpConfig.port === 465,
            auth: {
                user: smtp_1.SmtpConfig.user,
                pass: smtp_1.SmtpConfig.pass,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        const mailSent = await transport.sendMail({
            text: this.u_text,
            subject: this.u_subject,
            from: this.u_from,
            to: this.u_to,
            html: this.u_html,
        });
        return mailSent;
    }
}
exports.EmailSender = EmailSender;
