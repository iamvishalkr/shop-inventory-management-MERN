import nodemailer, { type TransportOptions } from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT || 465);
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "127.0.0.1",
    port: smtpPort,
    secure: smtpPort === 465,
    auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    } : null,
} as TransportOptions);