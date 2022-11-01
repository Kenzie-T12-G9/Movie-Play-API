import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { AppError } from '../error/AppError';
import { SchemaOf } from 'yup'

export default class Ensuraces {

  static serializerData = (serializer: SchemaOf<any>) => async (request: Request, response: Response, next: NextFunction) => {
    const user = request.body;

    try {
        const data = await serializer.validate(user, {
            stripUnknown:true,
            abortEarly:false
        })

        request.body = data

        next()
    } catch (error) {
        if( error instanceof Error ){
            return response.status(400).json({
                name:error.name,
                // @ts-ignore ou // @ts-expect-error
                message:error.errors
            })
        }
    }
  }

  static async authentication(request: Request, response: Response, next: NextFunction){
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
            id: decoded.sub
        }

        return next()
    });
  };

  static async onlyAdm(request: Request, response: Response, next: NextFunction){
    if(!request.token.isAdm){
        throw new AppError('User is not admin',403)
    }

    return next()
  }
};
