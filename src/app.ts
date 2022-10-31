import 'reflect-metadata';

import express from 'express';
import handleErrorMiddleware from './middlewares/handleError.middleware';

const app = express();

app.use(handleErrorMiddleware);

export default app;
