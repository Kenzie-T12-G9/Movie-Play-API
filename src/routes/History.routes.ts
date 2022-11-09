import { Router } from 'express';
import controller from '../controllers/History.controller';
import Ensurances from '../middlewares/Ensurances.middleware';
import { schemaCreateHistory } from '../serializers/history.serizalizer';

export const historyRouter = Router();

historyRouter.post('', 
    Ensurances.serializerData(schemaCreateHistory),
    Ensurances.authentication,
    controller.create
)
historyRouter.get('', 
    Ensurances.authentication,
    controller.listAll
)
historyRouter.get('/movies', 
    Ensurances.authentication,
    controller.listAllMovies
)
historyRouter.get('/series',
    Ensurances.authentication,
    controller.listAllSeries
)
historyRouter.get('/movies/:id', 
    Ensurances.validIdParams,
    Ensurances.authentication,
    Ensurances.onlyAdm,
    controller.listMovie
)
historyRouter.get('/series/:id',
    Ensurances.validIdParams,
    Ensurances.authentication, 
    Ensurances.onlyAdm,
    controller.listSerie
)
historyRouter.delete('/:id',
    Ensurances.validIdParams,
    Ensurances.authentication, 
    Ensurances.onlyAdm,
    controller.delete
)

historyRouter.get(
  '/user/:id',
  Ensurances.validIdParams,
  Ensurances.authentication,
  Ensurances.onlyAdm,
  controller.listAllAdm
);
