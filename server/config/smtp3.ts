import * as nodemailer from 'nodemailer';
import { RESEND_API_KEY } from './dotenv';
import {Resend} from "resend"

export const createResendTransporter = () => {
    return nodemailer.createTransport({
        host: "smtp.resend.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "resend",
            pass: RESEND_API_KEY,
        },
    });
};


const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTestEmail = async () => {
  const data = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: "your-email@example.com",
    subject: "Hello from Resend",
    html: "<p>This is a test</p>",
  });

  console.log(data);
};