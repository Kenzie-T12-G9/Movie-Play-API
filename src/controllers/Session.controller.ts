import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';

import service from '../services/Session.service';

export default class SessionController {
  static async init(req: Request, res: Response) {
    const data = req.body;
    const resData = await service.init(data);
    return res.status(200).json(instanceToPlain(resData));
  }
}
