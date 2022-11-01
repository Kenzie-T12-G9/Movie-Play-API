import { Router } from "express";

import controller from "../controllers/Session.controller";

export const sessionRouter = Router()

sessionRouter.post('', controller.init )