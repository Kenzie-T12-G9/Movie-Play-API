import { hash } from 'bcryptjs'
import AppDataSource from '../data-source';
import { PaymentMethods } from '../entities/PaymentMethods.entity';
import { Users } from '../entities/Users.entity';
import { AppError } from '../error/AppError';
import { IUserRequestBody } from '../interfaces/users';

export default class UsersService {
  static repository = AppDataSource.getRepository(Users)
  static paymentRepo = AppDataSource.getRepository(PaymentMethods)

  static async create({ name, email, password, paymentInfo }: IUserRequestBody) {

    const emailAlreadyExists = await this.repository.findOneBy({email})

    if(emailAlreadyExists){
      throw new AppError('Email already exists 😭',400)
    }

    if(!password){
      throw new AppError('Password is a required field',400)
    }
    const hashedPassword = await hash(password, 10)

    const newPayment = this.paymentRepo.create(paymentInfo)
    await this.paymentRepo.save(newPayment)

    const newUser = this.repository.create({
      name,
      email,
      password: hashedPassword,
      PaymentMethods: newPayment
    })

    const user = await this.repository.save(newUser)

    return user
  }

  static read() {}

  static readById(id: string) {}

  static update(id: string, updates: IUserRequestBody) {}

  static delete(id: string) {}
}
