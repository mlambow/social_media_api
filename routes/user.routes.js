import { Router } from "express";
import { deleteUser, getUserById, getUsers, updateUser } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', authMiddleware, getUsers);

userRouter.get('/:id', authMiddleware, getUserById);

userRouter.put('/:id', authMiddleware, updateUser);

userRouter.delete('/:id', authMiddleware, deleteUser);

export default userRouter;