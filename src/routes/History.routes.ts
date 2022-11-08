import { Router } from "express";
import controller from "../controllers/History.controller";
import Ensuraces from "../middlewares/Ensures.middleware";
import { schemaCreateHistory } from "../serializers/history.serizalizer";

export const historyRouter = Router()

historyRouter.post('', 
    Ensuraces.serializerData(schemaCreateHistory),
    Ensuraces.authentication,
    controller.create
)
historyRouter.get('', 
    Ensuraces.authentication,
    controller.listAll
)
historyRouter.get('/movies', 
    Ensuraces.authentication,
    controller.listAllMovies
)
historyRouter.get('/series',
    Ensuraces.authentication,
    controller.listAllSeries
)
historyRouter.get('/movies/:id', 
    Ensuraces.validIdParams,
    Ensuraces.authentication,
    controller.listMovie
)
historyRouter.get('/series/:id',
    Ensuraces.validIdParams,
    Ensuraces.authentication, 
    controller.listSerie
)

