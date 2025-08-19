import {  Router } from 'express';

const postRouter = Router();

postRouter.post('/', (req, res) => res.send({ title: 'Create a post' }));

postRouter.get('/', (req, res) => res.send({ title: 'Get all posts' }));

postRouter.get('/:id', (req, res) => res.send({ title: 'Get a single post' }));

postRouter.put('/:id', (req, res) => res.send({ title: 'Update a post' }));

postRouter.delete('/:id', (req, res) => res.send({ title: 'Delete a post' }));

postRouter.get('/users/:id', (req, res) => res.send({ title: 'Get the users post' }));

export default postRouter;