import nodemailer from 'nodemailer'
import { Resend } from 'resend';
export interface emailMessage {
    to: string,
    subject: string,
    text: string,
    html: string
}

interface EmailClient {
    sendEmail(message: emailMessage): Promise<void>
}
type Emailsender = "resend" | "smtp";
class ResendEmailClient implements EmailClient {
    private resend: Resend
    private APIkey: string;
    private from: string;

    constructor() {
        const APIkey = process.env.RESEND_API_KEY
        const from = process.env.RESEND_FROM
        const resend = new Resend(APIkey)

        if (!APIkey) throw new Error("Resend mailer api key is not set!")
        if (!from) throw new Error("Resend from address is not set !");

        this.APIkey = APIkey;
        this.from = from;
        this.resend = resend
    }
    async sendEmail(message: emailMessage): Promise<void> {
        // console.log("senEmail Called")
        const result = await this.resend.emails.send({
            from: this.from,
            to: message.to,
            subject: message.subject,
            text: message.text,
            html: message.html
        })
        if (result.error) {
            throw new Error(`Resend emailer failed ${result.error.message} `)
        }
    }
}

export function getEmailClient(sender: Emailsender): EmailClient {

    if (sender === "resend") {
        return new ResendEmailClient();
    }

    return new GmailEmailClient();
}

export async function sendEmail(sender: Emailsender, message: emailMessage): Promise<void> {
    const client = getEmailClient(sender);
    await client.sendEmail(message);
}

class GmailEmailClient implements EmailClient {
    private host: string;
    private port: number;
    private user?: string;
    private password?: string;

    constructor() {
        const host = process.env.SMTP_HOST;
        const port = Number(process.env.SMTP_PORT);
        const from = process.env.SMTP_USER;
        const password = process.env.SMTP_PASS;

        if (!host) throw new Error('SMTP_HOST is not set!');
        if (!port) throw new Error('SMTP_PORT is not set!');
        if (!from) throw new Error('SMTP_USER is not set!');
        if (!password) throw new Error('SMTP_USER is not set!');
        this.host = host;
        this.port = port;
        this.user = from;
        this.password = password;
    }
    async sendEmail(message: emailMessage): Promise<void> {
        const transporter = nodemailer.createTransport({
            host: this.host,
            port: this.port,
            secure: false,
            auth: {
                user: this.user,
                pass: this.password
            }
        })
        await transporter.sendMail({
            from: `Oura-Shop ${this.user}`,
            to: message.to,
            subject: message.subject,
            text: message.text,
            html: message.html
        })
    }
}




