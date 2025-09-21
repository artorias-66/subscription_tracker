import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import {
    createSubscription,
    getUserSubscriptions,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription,
    cancelSubscription,
    getUpcomingRenewals,
} from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

// 🔹 Create a new subscription
subscriptionRouter.post('/', authorize, createSubscription);

// 🔹 Get all subscriptions of a specific user
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

// 🔹 Get subscription details by ID
subscriptionRouter.get('/:id', authorize, getSubscriptionById);

// 🔹 Update subscription by ID
subscriptionRouter.put('/:id', authorize, updateSubscription);

// 🔹 Delete subscription by ID
subscriptionRouter.delete('/:id', authorize, deleteSubscription);

// 🔹 Cancel subscription by ID
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

// 🔹 Get upcoming renewals (next 7 days)
subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);

export default subscriptionRouter;
