import { Router } from "express";

const authRouter = Router();

authRouter.post('/sign-up', (req, res) => res.send({ title: 'sign up to be able to post' }));

authRouter.post('/sign-in', (req, res) => res.send({ title: 'sign in to your account' }));

authRouter.post('/sign-out', (req, res) => res.send({ title: 'sign out from your account' }));

export default authRouter;