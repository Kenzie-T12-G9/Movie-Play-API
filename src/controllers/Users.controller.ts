import { Request, Response } from 'express';
// prettier-ignore
import { IUserList, IUserRequestBody, IUserResponse, IUserUpdate } from '../interfaces/users';
import UsersService from '../services/Users.service';
import service from '../services/Users.service';

export default class UsersController {
  static async create(req: Request, res: Response) {

    const createUser: IUserRequestBody = req.body
    const newUser = await UsersService.create(createUser)
    return res.status(201).json(newUser)
    
  }

  static read(_: Request, res: IUserList) {}

  static update(req: IUserUpdate, res: IUserResponse) {}

  static delete(req: IUserRequestBody, res: Response) {}
}
