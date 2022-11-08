import { Router } from "express";
import controller from "../controllers/History.controller";
import Ensurances from "../middlewares/Ensurances.middleware";
import { schemaCreateHistory } from "../serializers/history.serizalizer";

export const historyRouter = Router()

historyRouter.post('', 
    Ensurances.serializerData(schemaCreateHistory),
    Ensurances.authentication,
    controller.create
)
historyRouter.get('', 
    Ensurances.authentication,
    controller.listAll
)
historyRouter.get('/all/movie', 
    Ensurances.authentication,
    controller.listAllMovies
)
historyRouter.get('/all/series',
    Ensurances.authentication,
    controller.listAllSeries
)
historyRouter.get('/movie/:id', 
    Ensurances.validIdParams,
    Ensurances.authentication,
    controller.listMovie
)
historyRouter.get('/serie/:id',
    Ensurances.validIdParams,
    Ensurances.authentication, 
    controller.listSerie
)

historyRouter.get('/user/:id', 
    Ensurances.validIdParams,
    Ensurances.authentication,
    Ensurances.onlyAdm,
    controller.listAllAdm
)
