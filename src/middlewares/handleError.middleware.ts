import { Request, Response } from 'express';
import { AppError } from '../error/AppError';

export default class MiddlewareErrors {
  static handler(error: Error, _: Request, res: Response) {
    if (error instanceof AppError) {
      return res.status(error.status).send({ message: error.message });
    }
    console.error(error);

    return res.status(500).send({ message: 'Internal server Error' });
  }
}
