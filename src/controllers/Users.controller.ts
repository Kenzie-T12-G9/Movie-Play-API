import { Request } from 'express';
// prettier-ignore
import { IUserList, IUserRequest, IUserResponse, IUserUpdate } from '../interfaces/users';
import service from '../services/Users.service';

export default class UsersController {
  static async create(req: IUserRequest, res: IUserResponse) {}

  static read(_: Request, res: IUserList) {}

  static update(req: IUserUpdate, res: IUserResponse) {}

  static delete(req: IUserRequest, res: Response) {}
}
