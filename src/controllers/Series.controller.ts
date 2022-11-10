import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import service from '../services/Series.service';

export default class SeriesController {
  static async create(req: Request, res: Response) {
    const data = req.body;
    const resData = await service.create(data);
    return res.status(201).json(instanceToPlain(resData));
  }

  static async list(_: Request, res: Response) {
    const resData = await service.list();
    return res.status(200).json(instanceToPlain(resData));
  }

  static async listOne(req: Request, res: Response) {
    const { id } = req.params;
    const resData = await service.listOne(id);
    return res.status(200).json(instanceToPlain(resData));
  }

  static async update(req: Request, res: Response) {
    const data = req.body;
    const { id } = req.params;

    const resData = await service.update(id, data);
    return res.status(200).json(resData);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    await service.delete(id);
    return res.status(204).json();
  }

  static async addEpisodeo(req: Request, res: Response) {
    const data = req.body;
    const { id } = req.params;

    const resData = await service.addEpisode(id, data);
    return res.status(201).json(instanceToPlain(resData));
  }

  static async deleteEpisode(req: Request, res: Response) {
    const { id } = req.params;
    await service.deleteEpisode(id);

    return res.status(204).json();
  }
}
