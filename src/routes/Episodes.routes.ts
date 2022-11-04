import { Router } from 'express';
import episodes from '../controllers/Episodes.controller';
import Ensuraces from '../middlewares/Ensures.middleware';
import { shemaUpdateEpisodes } from '../serializers/Episodes.serializer';

export const episodesRouter = Router();

episodesRouter.patch(
  '/:id',
  Ensuraces.authentication,
  Ensuraces.onlyAdm,
  Ensuraces.removeEmptyProperties,
  Ensuraces.serializerData(shemaUpdateEpisodes),
  episodes.update
);
episodesRouter.delete(
  '/:id',
  Ensuraces.authentication,
  Ensuraces.onlyAdm,
  episodes.delete
);

