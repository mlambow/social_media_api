import express from 'express';
import { PORT, NODE_ENV } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import commentRouter from './routes/comments.routes.js';
import connectToDatabase from './database/mongodb.js';

const app = express();

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Social Media')
})

app.listen(PORT, async () => {
  console.log(`Server is running on ${NODE_ENV} port ${PORT} http://localhost:${PORT}`);

  await connectToDatabase()
});

export default app;