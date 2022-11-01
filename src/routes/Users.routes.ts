import { Router } from "express";

import UsersController from "../controllers/Users.controller";

import Ensuraces from "../middlewares/Ensures.middleware";

import { shemaCreateUser } from "../serializers/Users.serializer";

export const userRouter = Router()

userRouter.post('',Ensuraces.serializerData(shemaCreateUser), UsersController.create)
userRouter.get('', UsersController.read)
userRouter.get('/:id/payment', UsersController.readById)
userRouter.patch('',)
userRouter.delete('',)