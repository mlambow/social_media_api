import { Router } from "express";
import { deleteUser, followUser, getUserById, getUsers, unfollowUser, updateUser } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', authMiddleware, getUsers);

userRouter.get('/:id', authMiddleware, getUserById);

userRouter.put('/:id', authMiddleware, updateUser);

userRouter.delete('/:id', authMiddleware, deleteUser);

userRouter.post(':id/follow', authMiddleware, followUser);

userRouter.post(':id/unfollow', authMiddleware, unfollowUser);

export default userRouter;