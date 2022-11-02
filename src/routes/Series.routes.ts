import { Router } from "express";
import controller from "../controllers/Series.controller";
import Ensuraces from "../middlewares/Ensures.middleware";
import { shemaAddEpisodeoSerie, shemaCreateSerie, shemaUpdateSerie } from "../serializers/Series.serializer";

export const seriesRouter = Router()

seriesRouter.post('/episodeos/:id',
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

seriesRouter.patch('/:id',
    Ensuraces.authentication,
    Ensuraces.onlyAdm,
    Ensuraces.removeEmptyProperties,
    Ensuraces.serializerData(shemaUpdateSerie),
    controller.update
)

seriesRouter.delete('/:id',
    Ensuraces.authentication,
    Ensuraces.onlyAdm,
    controller.delete
)
