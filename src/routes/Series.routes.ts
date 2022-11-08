import { Router } from "express";
import controller from "../controllers/Series.controller";
import Ensuraces from "../middlewares/Ensurances.middleware";
import { shemaAddEpisodeoSerie, shemaCreateSerie, shemaUpdateSerie } from "../serializers/Series.serializer";

export const seriesRouter = Router()

seriesRouter.post('/:id/episodes',
    Ensuraces.validIdParams,
    Ensuraces.authentication,
    Ensuraces.onlyAdm,
    Ensuraces.serializerData(shemaAddEpisodeoSerie),
    controller.addEpisodeo
)

seriesRouter.post('',
    Ensuraces.authentication,
    Ensuraces.onlyAdm,
    Ensuraces.serializerData(shemaCreateSerie),
    controller.create
)

seriesRouter.get('',
    controller.list
)

seriesRouter.get('/:id',
    Ensuraces.validIdParams,
    controller.listOne
)


seriesRouter.patch('/:id',
    Ensuraces.validIdParams,
    Ensuraces.authentication,
    Ensuraces.onlyAdm,
    Ensuraces.removeEmptyProperties,
    Ensuraces.serializerData(shemaUpdateSerie),
    controller.update
)

seriesRouter.delete('/:id',
    Ensuraces.validIdParams,
    Ensuraces.authentication,
    Ensuraces.onlyAdm,
    controller.delete
)
