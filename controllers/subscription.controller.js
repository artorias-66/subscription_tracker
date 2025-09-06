import Subscription from '../models/subscription.model.js';
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL } from '../config/env.js';
import { sendReminderEmail } from '../utils/send-email.js';

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        console.log('[createSubscription] Subscription created:', subscription.id);

        // 🔹 Trigger workflow
        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: { subscriptionId: subscription.id },
            headers: { 'content-type': 'application/json' },
            retries: 0,
        });

        console.log('[createSubscription] Workflow triggered:', workflowRunId);

        // 🔹 Send test reminder email immediately (pick template)
        try {
            console.log('[createSubscription] Sending reminder email now...');

            await sendReminderEmail({
                to: req.user.email,        // must be present in your token
                type: 'reminder_7days',    // 👈 updated to match new template labels
                subscription,
            });

            console.log('[createSubscription] Reminder email sent successfully.');
        } catch (emailErr) {
            console.error('[createSubscription] Failed to send email:', emailErr);
        }

        res.status(201).json({
            success: true,
            data: { subscription, workflowRunId },
        });
    } catch (e) {
        console.error('[createSubscription] Error:', e);
        next(e);
    }
};

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw  error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });
        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        console.error('[getUserSubscriptions] Error:', e);
        next(e);
    }
};
