import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { AppError } from '../error/AppError';
import { SchemaOf, ValidationError } from 'yup';
import { schemaValidIdParams, schemaValidMovieIdParams, schemaValidSerieIdParams, schemaValidUserIdParams } from '../serializers/methods.serializer';

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

  static validIdParams = async ( req:Request, res:Response, next:NextFunction ) => {

    const { id } = req.params

    try {
      await schemaValidIdParams.validate({id}, {
        stripUnknown: true,
        abortEarly: false,
      });

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new AppError(error.errors[0], 400);
      }
    }
  };

  static validMovieIdParams = async ( req:Request, res:Response, next:NextFunction ) => {

    const { movieId } = req.params

    try {
      await schemaValidMovieIdParams.validate({movieId}, {
        stripUnknown: true,
        abortEarly: false,
      });

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new AppError(error.errors[0], 400);
      }
    }
  };

  static validSerieIdParams = async ( req:Request, res:Response, next:NextFunction ) => {

    const { serieId } = req.params

    try {
      await schemaValidSerieIdParams.validate({serieId}, {
        stripUnknown: true,
        abortEarly: false,
      });

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new AppError(error.errors[0], 400);
      }
    }
  };

  static validUserIdParams = async ( req:Request, res:Response, next:NextFunction ) => {

    const { userId } = req.params

    try {
      await schemaValidUserIdParams.validate({userId}, {
        stripUnknown: true,
        abortEarly: false,
      });

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new AppError(error.errors[0], 400);
      }
    }
  };
  
}
