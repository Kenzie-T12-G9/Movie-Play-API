import { Request, Response } from 'express';
import { AppError } from '../error/AppError';

const handleErrorMiddleware = (error: Error, req: Request, res: Response) => {
  if (error instanceof AppError) {
    return res.status(error.status).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: 'Internal error',
  });
};

export default handleErrorMiddleware;
