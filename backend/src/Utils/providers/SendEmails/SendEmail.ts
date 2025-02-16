import nodemailer from "nodemailer";
import { SmtpConfig } from "../../configs/smtp";
import fs from "fs"
import path from "path"

const htmlpath = path.join(__dirname, "./Templates/welcome.html");
const HTML = fs.readFileSync(htmlpath, "utf-8");
console.log(HTML)
/***
 * =========================================================
 *  MedimapAngola.ao
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

async function Emailsent(email: string)
{
    const emailSenderInstance = new EmailSender({
        text: "A equipa da MediMapAngola dá-lhe as boas-vindas.",
        subject: "Welcome",
        from: "noreplaymedimapangola@gmail.com",
        to: email,
        html: HTML,
      });
      await emailSenderInstance.SendEmail().catch((error)=>{console.log("Erro ao enviar este email: ", error)});
}

export {Emailsent}