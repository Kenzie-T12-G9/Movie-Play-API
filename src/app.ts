import 'reflect-metadata';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import documentation from './documentation/api-documentation.json';

import handleErrorMiddleware from './middlewares/handleError.middleware';
import { userRouter } from './routes/Users.routes';
import { ratingsRouter } from './routes/Ratings.routes';
import { historyRouter } from './routes/History.routes';
import { moviesRouter } from './routes/Movies.routes';
import { seriesRouter } from './routes/Series.routes';
import { sessionRouter } from './routes/Session.routes';
import { authorsPage } from './documentation/authors';

const app = express();
app.use(express.json());

app.use('/documentation', swaggerUi.serve, swaggerUi.setup(documentation));
app.use('/authors', authorsPage);

app.use('/users', userRouter);
app.use('/login', sessionRouter);
app.use('/ratings', ratingsRouter);
app.use('/history', historyRouter);
app.use('/movies', moviesRouter);
app.use('/series', seriesRouter);

app.use(handleErrorMiddleware);

export default app;
