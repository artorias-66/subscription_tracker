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

<<<<<<< HEAD
// Specific routes first (static paths)
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);
=======
// Create a new subscription
subscriptionRouter.post('/', authorize, createSubscription);

// Get all subscriptions of a specific user
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

//  Get subscription details by ID
subscriptionRouter.get('/:id', authorize, getSubscriptionById);

// Update subscription by ID
subscriptionRouter.put('/:id', authorize, updateSubscription);

// Delete subscription by ID
subscriptionRouter.delete('/:id', authorize, deleteSubscription);

// Cancel subscription by ID
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

// 🔹 Get upcoming renewals (next 7 days)
>>>>>>> d44a4bfd2698a9eaba282709bd2b9a1cbcf298b8
subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);

// Param routes after; constrain :id to a 24-char hex ObjectId
subscriptionRouter.get('/:id([0-9a-fA-F]{24})', authorize, getSubscriptionById);
subscriptionRouter.put('/:id([0-9a-fA-F]{24})', authorize, updateSubscription);
subscriptionRouter.delete('/:id([0-9a-fA-F]{24})', authorize, deleteSubscription);
subscriptionRouter.put('/:id([0-9a-fA-F]{24})/cancel', authorize, cancelSubscription);

export default subscriptionRouter;