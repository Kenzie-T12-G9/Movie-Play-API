import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { AppError } from '../error/AppError';

export default class Ensuraces {
    static async authentication(request: Request, response: Response, next: NextFunction){
        
    }
}
