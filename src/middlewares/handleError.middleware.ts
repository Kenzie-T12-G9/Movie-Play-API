import { Request, Response } from 'express';
import { AppError } from '../error/AppError';

const handleErrorMiddleware = (error: Error, _: Request, res: Response) => {
  if (error instanceof AppError) {
    return res.status(error.status).send({
      message: error.message,
    });
  }

  return res.status(500).send({
    message: 'Internal error',
  });
};

export default handleErrorMiddleware;
