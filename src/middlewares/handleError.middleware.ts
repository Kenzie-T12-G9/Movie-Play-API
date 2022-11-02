import { Request, Response } from 'express';
import { AppError } from '../error/AppError';

class ErrorMiddleware {
  static handler(error: Error, _: Request, res: Response) {
    if (error instanceof AppError) {
      return res.status(error.status).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: 'Internal error',
    });
  }
}

export default ErrorMiddleware;
