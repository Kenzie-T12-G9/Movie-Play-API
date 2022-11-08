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
historyRouter.get('/all/movie', 
    Ensuraces.authentication,
    controller.listAllMovies
)
historyRouter.get('/all/series',
    Ensuraces.authentication,
    controller.listAllSeries
)
historyRouter.get('/movie/:id', 
    Ensuraces.validIdParams,
    Ensuraces.authentication,
    controller.listMovie
)
historyRouter.get('/serie/:id',
    Ensuraces.validIdParams,
    Ensuraces.authentication, 
    controller.listSerie
)

