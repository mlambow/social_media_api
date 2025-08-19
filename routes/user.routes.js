import { Router } from "express";

const userRouter = Router();

userRouter.get('/:id', (req, res) => res.send({ title: 'users details' }));

userRouter.put('/:id', (req, res) => res.send({ title: 'users details edit' }));

userRouter.delete('/:id', (req, res) => res.send({ title: 'delete a user' }));

userRouter.post('/', (req, res) => res.send({ title: 'create a user' }));

export default userRouter;