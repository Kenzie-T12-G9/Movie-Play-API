import { Router } from "express";
import controller from "../controllers/Episodes.controller";
import Ensuraces from "../middlewares/Ensures.middleware";
import { shemaUpdateEpisodes } from "../serializers/Episodes.serializer";

export const episodesRouter = Router()

episodesRouter.patch('/:id',
    Ensuraces.validIdParams,
    Ensuraces.authentication,
    Ensuraces.onlyAdm,
    Ensuraces.removeEmptyProperties,
    Ensuraces.serializerData(shemaUpdateEpisodes),
    controller.update
)
episodesRouter.delete('/:id',
    Ensuraces.validIdParams,
    Ensuraces.authentication,
    Ensuraces.onlyAdm,
    controller.delete
)
