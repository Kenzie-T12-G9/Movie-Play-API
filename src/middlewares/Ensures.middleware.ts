import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { AppError } from '../error/AppError';
import { SchemaOf, ValidationError } from 'yup';

export default class Ensuraces {
  static serializerData =
    (serializer: SchemaOf<any>) =>
    async (request: Request, _: Response, next: NextFunction) => {
      const user = request.body;

      try {
        const data = await serializer.validate(user, {
          stripUnknown: true,
          abortEarly: false,
        });

        request.body = data;

        next();
      } catch (error) {
        if (error instanceof ValidationError) {
          // @ts-ignore ou // @ts-expect-error
          throw new AppError(error.errors, 400);
        }
      }
    };

  static async authentication(
    request: Request,
    _: Response,
    next: NextFunction
  ) {
    let token = request.headers.authorization;

    if (!token) {
      throw new AppError('Missing authorization token', 401);
    }

    token = token.split(' ')[1];

    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      (error, decoded: any) => {
        if (error) {
          throw new AppError('Invalid Token', 401);
        }

        request.token = {
          isAdm: decoded.isAdm,
          id: decoded.sub,
        };

        return next();
      }
    );
  }

  static async onlyAdm(request: Request, _: Response, next: NextFunction) {
    if (!request.token.isAdm) {
      throw new AppError('User is not admin', 403);
    }

    return next();
  }

  static async removeEmptyProperties(
    request: Request,
    _: Response,
    next: NextFunction
  ) {
    const data = request.body;

    const remove = Object.fromEntries(
      Object.entries(data).filter((prop) => prop[1])
    );

    request.body = remove;

    next();
  }
}
