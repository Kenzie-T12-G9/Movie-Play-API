import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
// prettier-ignore
import { IUserList, IUserRequestBody, IUserResponse, IUserUpdate } from '../interfaces/users';
import UsersService from '../services/Users.service';
import service from '../services/Users.service';

export default class UsersController {
  static async create(req: Request, res: Response) {

    const data: IUserRequestBody = req.body
    const newUser = await UsersService.create(data)
    return res.status(201).json(instanceToPlain(newUser))

  }

  static async read(_: Request, res: Response) {
    const users = await UsersService.read()
    return res.json(instanceToPlain(users))
  }

  static async readById(req: Request, res: Response) {
    const { id } = req.params
    const users = await UsersService.readById(id)
    return res.json(users)
  }

  static update(req: IUserUpdate, res: IUserResponse) {}

  static delete(req: IUserRequestBody, res: Response) {
    
  }
}
