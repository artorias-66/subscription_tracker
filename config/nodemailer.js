import nodemailer from 'nodemailer';
import { EMAIL_PASSWORD } from './env.js';

export const accountEmail = 'anubhavverma233@gmail.com';

console.log('[Nodemailer] Creating transporter...');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: accountEmail,
        pass: EMAIL_PASSWORD,
    },
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('[Nodemailer] Transporter verification failed:', error);
    } else {
        console.log('[Nodemailer] Transporter ready:', success);
    }
});

export default transporter;
