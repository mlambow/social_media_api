import { Router } from 'express';

const commentRouter = Router()

commentRouter.post('/post/:id', (req, res) => res.send({ title: 'Post a comment' }));

commentRouter.get('/post/:id', (req, res) => res.send({ title: 'Get all posts' }));

commentRouter.put('/:id', (req, res) => res.send({ title: 'Update a comment' }));

commentRouter.delete('/:id', (req, res) => res.send({ title: 'Delete a comment' }));

export default commentRouter;