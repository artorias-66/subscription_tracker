import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', getUsers); // optional: only admin
userRouter.get('/:id', authorize, getUser);
userRouter.post('/', createUser);
userRouter.put('/:id', authorize, updateUser);
userRouter.delete('/:id', authorize, deleteUser);

export default userRouter;
