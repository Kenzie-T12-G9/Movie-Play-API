import { Request } from 'express';
import { IUserList, IUserRequest, IUserResponse } from '../interfaces/users';

export default class UsersController {
  static create(req: IUserRequest, res: IUserResponse) {}

  static read(_: Request, res: IUserList) {}

  static update(req: IUserRequest, res: IUserResponse) {}

  static delete(req: IUserRequest, res: Response) {}
}
