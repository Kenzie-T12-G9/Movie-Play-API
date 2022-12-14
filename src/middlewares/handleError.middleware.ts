import { Request, Response, NextFunction } from 'express';
import { AppError } from '../error/AppError';

export default class MiddlewareErrors {
  static handler(error: Error, _: Request, res: Response, next: NextFunction) {
    if (error instanceof AppError) {
      return res.status(error.status).json({
        message: error.message,
      });
    }
    console.error(error);

    return res.status(500).json({
      message: 'Internal error',
    });
  }
}
