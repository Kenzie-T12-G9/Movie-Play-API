import { instanceToPlain } from 'class-transformer';
// import { instanceToPlain } from '../interfaces/users'
import { Request, Response } from 'express';
// prettier-ignore
import { IUserDelete, IUserRequestBody, IUserResponse, IUserUpdate } from '../interfaces/users';
import UsersService from '../services/Users.service';

export default class UsersController {
  static async create(req: Request, res: Response) {
    const data: IUserRequestBody = req.body;
    const newUser = await UsersService.create(data);
    return res.status(201).send(instanceToPlain(newUser));
  }

  static async read(_: Request, res: Response) {
    const users = await UsersService.read();
    return res.status(200).send(instanceToPlain(users));
  }

  static async readById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await UsersService.readById(id);
    return res.status(200).send(instanceToPlain(user));
  }

  static async update(req: IUserUpdate, res: IUserResponse) {
    const { id } = req.params;
    const updatedUser = await UsersService.update(id, req.body);
    return res.status(200).send(instanceToPlain(updatedUser));
  }

  static async delete(req: IUserDelete, res: Response) {
    const { id } = req.params;
    await UsersService.delete(id);
    return res.status(204).send();
  }
}
