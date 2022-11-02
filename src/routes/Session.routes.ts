import { Router } from "express";

import controller from "../controllers/Session.controller";

import Ensuraces from "../middlewares/Ensures.middleware";

import { schemaIinitSession } from "../serializers/Session.serializer";

export const sessionRouter = Router()

sessionRouter.post('', 
    Ensuraces.serializerData(schemaIinitSession),
    controller.init 
)