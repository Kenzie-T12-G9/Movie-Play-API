import { Request } from 'express';
// prettier-ignore
import { IUserList, IUserRequest, IUserResponse, IUserUpdate } from '../interfaces/users';

export default class UsersController {
  static create(req: IUserRequest, res: IUserResponse) {}

  static read(_: Request, res: IUserList) {}

  static update(req: IUserUpdate, res: IUserResponse) {}

  static delete(req: IUserRequest, res: Response) {}
}
