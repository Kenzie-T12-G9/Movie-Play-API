import { IUserRequestBody } from '../interfaces/users';

export default class UsersService {
  static create({ name, email, password, isAdm }: IUserRequestBody) {}

  static read() {}

  static readById(id: string) {}

  static update(body: IUserRequestBody) {}

  static delete() {}
}
