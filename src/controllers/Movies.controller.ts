import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import service from '../services/Movies.service';

export default class MoviesController {
  static async create(req: Request, res: Response) {
    const data = req.body;
    const createMovie = await service.create(data);
    return res.status(201).json(instanceToPlain(createMovie));
  }

  static async readAll(req: Request, res: Response) {
    const data = await service.readAll();
    return res.json(data);
  }

  static async read(req: Request, res: Response) {
    const { id } = req.params;
    const data = await service.read(id);
    return res.json(data);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    await service.delete(id);
    return res.status(204).send();
  }
}
