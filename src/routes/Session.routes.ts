import { Router } from 'express';
import session from '../controllers/Session.controller';
import Ensuraces from '../middlewares/Ensurances.middleware';
import { schemaIinitSession } from '../serializers/Session.serializer';

export const sessionRouter = Router();

sessionRouter.post('', Ensuraces.serializerData(schemaIinitSession), session.init);
