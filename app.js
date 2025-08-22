import express from 'express';
import cookieParser from 'cookie-parser';
import { PORT, NODE_ENV } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import commentRouter from './routes/comments.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);

app.use(errorMiddleware)

app.get('/', (req, res) => {
  res.send('Welcome to Social Media API')
})

app.listen(PORT, async () => {
  console.log(`Server is running on ${NODE_ENV} port ${PORT} http://localhost:${PORT}`);

  await connectToDatabase()
});

export default app;