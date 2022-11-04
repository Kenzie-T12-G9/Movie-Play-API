import { Request, Response } from 'express';
import path from 'path';

import service from '../services/Session.service';

export default class SessionController {
  static async init(req: Request, res: Response) {

    const data = req.body
    const resData = await service.init( data )
    return res.status(200).json(resData)
  }

  static options(_: Request, res: Response) {
    return res
      .status(200)
      .set({ 'Content-Type': 'text/plain' })
      .sendFile(path.join(__dirname, '../options/session.html'));
  }
}
