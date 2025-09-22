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

// Create a new subscription
subscriptionRouter.post('/', authorize, createSubscription);

// Get all subscriptions of a specific user
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

// Get subscription details by ID
subscriptionRouter.get('/:id([0-9a-fA-F]{24})', authorize, getSubscriptionById);

// Update subscription by ID
subscriptionRouter.put('/:id([0-9a-fA-F]{24})', authorize, updateSubscription);

// Delete subscription by ID
subscriptionRouter.delete('/:id([0-9a-fA-F]{24})', authorize, deleteSubscription);

// Cancel subscription by ID
subscriptionRouter.put('/:id([0-9a-fA-F]{24})/cancel', authorize, cancelSubscription);

// Get upcoming renewals (next 7 days)
subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);

export default subscriptionRouter;
