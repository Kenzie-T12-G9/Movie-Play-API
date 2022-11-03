import { hash } from 'bcryptjs';
import AppDataSource from '../data-source';
import { PaymentMethods } from '../entities/PaymentMethods.entity';
import { Users } from '../entities/Users.entity';
import { AppError } from '../error/AppError';
import { IUserRequestBody } from '../interfaces/users';

export default class UsersService {
  static repository = AppDataSource.getRepository(Users);
  static paymentRepo = AppDataSource.getRepository(PaymentMethods);

  static async create(data: IUserRequestBody) {
    const emailAlreadyExists = await this.repository.findOne({
      where: {
        email: data.email,
      },
    });

    if (emailAlreadyExists) {
      throw new AppError('Email already exists 😭', 400);
    }

    const { paymentMethods, ...userCreate } = data;

    const newPayment = this.paymentRepo.create(paymentMethods);
    await this.paymentRepo.save(newPayment);

    const newUser = this.repository.create({
      paymentMethods: newPayment,
      ...userCreate,
    });

    await this.repository.save(newUser);

    return newUser;
  }

  static async read() {
    const users = await this.repository.find();
    return users;
  }

  static async readById(id: string) {
    const usersPayment = await this.repository.findOne({
      where: {
        id,
      },
      relations: {
        paymentMethods: true,
      },
    });
    if (!usersPayment) {
      throw new AppError('User not found!', 404);
    }
    return usersPayment;
  }

  static update(id: string, updates: IUserRequestBody) {
    
  }

  static async delete(id: string) {
    const userExists = await this.repository.findOneBy({id})

    if(!userExists){
      throw new AppError('User does not exist',403)
    }

    await this.repository.delete(id)
  }
}
