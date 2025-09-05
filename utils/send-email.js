import { emailTemplates } from './email-template.js';
import dayjs from 'dayjs';
import transporter, { accountEmail } from '../config/nodemailer.js';

export const sendReminderEmail = async ({ to, type, subscription }) => {
    try {
        console.log('[sendReminderEmail] Called with:', { to, type });

        if (!to || !type) throw new Error('Missing required parameters');

        const template = emailTemplates.find((t) => t.label === type);
        console.log('[sendReminderEmail] Template found:', !!template);

        if (!template) throw new Error('Invalid email type');

        const mailInfo = {
            userName: subscription?.user?.name,
            subscriptionName: subscription?.name,
            renewalDate: dayjs(subscription?.renewalDate).format('MMM D, YYYY'),
            planName: subscription?.name,
            price: `${subscription?.currency} ${subscription?.price} (${subscription?.frequency})`,
            paymentMethod: subscription?.paymentMethod,
        };
        console.log('[sendReminderEmail] mailInfo:', mailInfo);

        const message = template.generateBody(mailInfo);
        const subject = template.generateSubject(mailInfo);

        console.log('[sendReminderEmail] Generated subject:', subject);
        console.log('[sendReminderEmail] Generated message length:', message?.length);

        const mailOptions = {
            from: accountEmail,
            to: to,
            subject: subject,
            html: message,
        };
        console.log('[sendReminderEmail] mailOptions:', mailOptions);

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('[sendReminderEmail] Error sending email:', error);
                return;
            }
            console.log('[sendReminderEmail] Raw Nodemailer response:', info);
        });

    } catch (err) {
        console.error('[sendReminderEmail] Caught error:', err);
        throw err;
    }
};
