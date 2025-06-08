import dotenv from 'dotenv';
import nodemailer from 'nodemailer'

dotenv.config();
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS
    }
  });