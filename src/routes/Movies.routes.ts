import { Router } from 'express';
import controller from '../controllers/Movies.controller';
import Ensuraces from '../middlewares/Ensurances.middleware';
import { schemaCreateMovie } from '../serializers/movies.serializer';

export const moviesRouter = Router();

moviesRouter.post(
  '',
  Ensuraces.serializerData(schemaCreateMovie),
  Ensuraces.authentication,
  Ensuraces.onlyAdm,
  controller.create
);
moviesRouter.get('', controller.readAll);
moviesRouter.get('/:id', Ensuraces.validIdParams, controller.read);
moviesRouter.delete(
  '/:id',
  Ensuraces.validIdParams,
  Ensuraces.authentication,
  Ensuraces.onlyAdm,
  controller.delete
);
