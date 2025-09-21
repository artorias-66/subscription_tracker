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

        // 🔹 Send test reminder email immediately 
        try {
            console.log('[createSubscription] Sending reminder email now...');
            const populatedSub = await Subscription.findById(subscription._id).populate("user");
            await sendReminderEmail({
                to: req.user.email,
                type: "reminder_7days",
                subscription: populatedSub,
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

// GET subscriptions of a user 
export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });
        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        console.error('[getUserSubscriptions] Error:', e);
        next(e);
    }
};

// GET subscription by ID
export const getSubscriptionById = async (req, res, next) => {
    try {
        const sub = await Subscription.findById(req.params.id).populate("user");
        if (!sub) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: sub });
    } catch (e) {
        console.error('[getSubscriptionById] Error:', e);
        next(e);
    }
};

// UPDATE subscription
export const updateSubscription = async (req, res, next) => {
    try {
        const sub = await Subscription.findById(req.params.id);
        if (!sub) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        if (sub.user.toString() !== req.user._id.toString()) {
            const error = new Error('You are not authorized to update this subscription');
            error.status = 401;
            throw error;
        }

        Object.assign(sub, req.body);
        await sub.save();

        res.status(200).json({ success: true, data: sub });
    } catch (e) {
        console.error('[updateSubscription] Error:', e);
        next(e);
    }
};

// DELETE subscription
export const deleteSubscription = async (req, res, next) => {
    try {
        const sub = await Subscription.findById(req.params.id);
        if (!sub) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        if (sub.user.toString() !== req.user._id.toString()) {
            const error = new Error('You are not authorized to delete this subscription');
            error.status = 401;
            throw error;
        }

        await sub.remove();
        res.status(200).json({ success: true, message: 'Subscription deleted successfully' });
    } catch (e) {
        console.error('[deleteSubscription] Error:', e);
        next(e);
    }
};

// CANCEL subscription
export const cancelSubscription = async (req, res, next) => {
    try {
        const sub = await Subscription.findById(req.params.id);
        if (!sub) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        if (sub.user.toString() !== req.user._id.toString()) {
            const error = new Error('You are not authorized to cancel this subscription');
            error.status = 401;
            throw error;
        }

        sub.status = 'canceled';
        sub.endDate = new Date();
        await sub.save();

        res.status(200).json({ success: true, data: sub });
    } catch (e) {
        console.error('[cancelSubscription] Error:', e);
        next(e);
    }
};

// GET upcoming renewals (next 7 days)
export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const subs = await Subscription.find({
            endDate: { $gte: today, $lte: nextWeek },
            status: 'active'
        }).populate("user");

        res.status(200).json({ success: true, data: subs });
    } catch (e) {
        console.error('[getUpcomingRenewals] Error:', e);
        next(e);
    }
};
