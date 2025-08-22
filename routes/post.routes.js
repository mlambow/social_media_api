import {  Router } from 'express';
import { createPost, deletePost, getPosts, getPostsByUser, getSinglePost, updatePost } from '../controllers/post.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const postRouter = Router();

postRouter.post('/', authMiddleware, createPost);

postRouter.get('/', authMiddleware, getPosts);

postRouter.get('/:id', authMiddleware, getSinglePost);

postRouter.put('/:id', authMiddleware, updatePost);

postRouter.delete('/:id', authMiddleware, deletePost);

postRouter.get('/user/:id', authMiddleware, getPostsByUser);

export default postRouter;