import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { createComment, getCommentsByPost, updateComment, getSingleComment, deleteComment } from '../controllers/comment.controller.js';

const commentRouter = Router()

commentRouter.post('/post/:id', authMiddleware, createComment);

commentRouter.get('/post/:id', authMiddleware, getCommentsByPost);

commentRouter.get('/:id', authMiddleware, getSingleComment);

commentRouter.put('/:id', authMiddleware, updateComment);

commentRouter.delete('/:id', authMiddleware, deleteComment);

export default commentRouter;