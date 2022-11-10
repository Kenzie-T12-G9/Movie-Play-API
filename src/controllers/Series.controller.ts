import { Request, Response } from 'express';
import service from '../services/Series.service';

export default class SeriesController {
  static async create(req: Request, res: Response) {

    const data = req.body
    const resData = await service.create( data )
    return res.status(201).json(resData)
  }

  static async list(req: Request, res: Response) {

    const resData = await service.list()
    return res.status(200).json(resData)
  }

  static async listOne(req: Request, res: Response) {

    const { id } = req.params
    const resData = await service.listOne( id )
    return res.status(200).json(resData)
  }

  static async update(req: Request, res: Response) {

    const data = req.body
    const { id } = req.params

    const resData = await service.update( id, data )
    return res.status(200).json(resData)
  }

  static async delete(req: Request, res: Response) {

    const { id } = req.params

    const resData = await service.delete( id )
    return res.status(204).json(resData)
  }

  static async addEpisodeo(req: Request, res: Response) {

    const data = req.body
    const { id } = req.params

    const resData = await service.addEpisode( id, data )
    return res.status(201).json(resData)
  }
}
