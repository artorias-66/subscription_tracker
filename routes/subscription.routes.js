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

// Specific routes first (static paths)
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);
subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);

// Param routes after; constrain :id to a 24-char hex ObjectId
subscriptionRouter.get('/:id([0-9a-fA-F]{24})', authorize, getSubscriptionById);
subscriptionRouter.put('/:id([0-9a-fA-F]{24})', authorize, updateSubscription);
subscriptionRouter.delete('/:id([0-9a-fA-F]{24})', authorize, deleteSubscription);
subscriptionRouter.put('/:id([0-9a-fA-F]{24})/cancel', authorize, cancelSubscription);

export default subscriptionRouter;