import { Router } from 'express';
import RatingsController from '../controllers/Ratings.controller';
import Ensurances from '../middlewares/Ensurances.middleware';

import { schemaCreateRating } from '../serializers/Ratings.serializer';

export const ratingsRouter = Router();

ratingsRouter.post(
  '/movies/:id',
  Ensurances.validIdParams,
  Ensurances.authentication,
  Ensurances.serializerData(schemaCreateRating),
  RatingsController.postUserRatingsOfaMovieController
);

ratingsRouter.post(
  '/series/:id',
  Ensurances.validIdParams,
  Ensurances.authentication,
  Ensurances.serializerData(schemaCreateRating),
  RatingsController.postUserRatingsOfaSerieController
);

ratingsRouter.get(
  '/movies/:id',
  Ensurances.validIdParams,
  RatingsController.listUserRatingsOfaMovieController
);

ratingsRouter.get(
  '/series/:id',
  Ensurances.validIdParams,
  RatingsController.listUserRatingsOfaSerieController
);

ratingsRouter.get('/movies', RatingsController.readAllRatingsMoviesController);

ratingsRouter.get('/series', RatingsController.readAllRatingsSeriesController);

ratingsRouter.delete(
  '/:id',
  Ensurances.validIdContentParams,
  Ensurances.validIdParams,
  Ensurances.authentication,
  RatingsController.deleteRatingController
);


