import nodemailer from "nodemailer";
import { SmtpConfig } from "../../configs/smtp";

/***
 * =========================================================
 *  MediMap.co.ao
 *  Aqui estou criando uma class para lidar com envio de emails
 *  by: Emanuel António.
 * =========================================================
 * ***/
type EmailProps =
{
    text: string;
    subject: string;
    from: string;
    to: string;
    html?: string;
};

export class EmailSender {
    private u_text: string;
    private u_subject: string;
    private u_from: string;
    private u_to: string;
    private u_html?: string;

    constructor(props: EmailProps) {
        this.u_text = props.text;
        this.u_subject = props.subject;
        this.u_from = props.from;
        this.u_to = props.to;
        this.u_html = props.html;
    }

    async SendEmail() {
        const transport = nodemailer.createTransport({
            host: SmtpConfig.host,
            port: SmtpConfig.port,
            secure: SmtpConfig.port === 465,
            auth: {
                user: SmtpConfig.user,
                pass: SmtpConfig.pass,
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