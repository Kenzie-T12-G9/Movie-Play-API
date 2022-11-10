import AppDataSource from '../data-source';
import { Users } from '../entities/Users.entity';
import { AppError } from '../error/AppError';
import { IUserLoginBody } from '../interfaces/users';

import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import { schemaResSession } from '../serializers/Users.serializer';
config();

export default class SessionService {
  static repository = AppDataSource.getRepository(Users);

  static async init({ email, password }: IUserLoginBody) {
    const user = await this.repository.findOneBy({ email, isActive: true });

    if (!user) {
      throw new AppError('Email/password is wrong', 401);
    }

    const hashedPassword = bcrypt.compareSync(password, user.password);

    if (!hashedPassword) {
      throw new AppError('Email/password is wrong', 401);
    }

    const token = sign(
      { isAdm: user.isAdm },
      process.env.SECRET_KEY as string,
      {
        expiresIn: '1d',
        subject: user.id,
      }
    );

    return { user, token };
  }
}
