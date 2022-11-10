import { Router } from 'express';
import UsersController from '../controllers/Users.controller';
import Ensuraces from '../middlewares/Ensurances.middleware';
import { shemaCreateUser, shemaUpdateUser } from '../serializers/Users.serializer';

export const userRouter = Router();

userRouter.post('', Ensuraces.serializerData(shemaCreateUser), UsersController.create);
userRouter.get('', Ensuraces.authentication, Ensuraces.onlyAdm, UsersController.read);
userRouter.get('/:id', Ensuraces.authentication, Ensuraces.partialPermissions, UsersController.readById);
userRouter.patch('/:id', Ensuraces.authentication, Ensuraces.partialPermissions, Ensuraces.serializerData(shemaUpdateUser), UsersController.update);
userRouter.delete('/:id', Ensuraces.authentication, Ensuraces.partialPermissions, UsersController.delete);
