import { Request, Response } from 'express';

import service from '../services/Episodes.service';

export default class EpisodeController {
  static async update(req: Request, res: Response) {

    const data = req.body
    const { id } = req.params

    const resData = await service.update( id, data )
    return res.status(200).json(resData)
  }
  static async delete(req: Request, res: Response) {

    const { id } = req.params

    await service.delete( id )
    return res.status(204).send()
  }
}