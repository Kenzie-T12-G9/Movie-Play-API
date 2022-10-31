import 'reflect-metadata';

import express from 'express';
import handleErrorMiddleware from './middlewares/handleError.middleware';
import { userRouter } from './routes/Users.routes';

const app = express();

app.use('/users', userRouter)

app.use(handleErrorMiddleware);

export default app;
