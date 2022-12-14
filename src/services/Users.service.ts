import { hash } from 'bcryptjs';
import AppDataSource from '../data-source';
import { PaymentMethods } from '../entities/PaymentMethods.entity';
import { Users } from '../entities/Users.entity';
import { AppError } from '../error/AppError';
import { IUserRequestBody, IUserUpdateRequest } from '../interfaces/users';
import { expired, partialUpdates } from '../utils';

export default class UsersService {
  static repository = AppDataSource.getRepository(Users);
  static paymentRepo = AppDataSource.getRepository(PaymentMethods);

  static async create({ name, email, password, isAdm, paymentMethods }: IUserRequestBody): Promise<Users> {
    const user = await this.repository.findOneBy({ email });

    if (user && user.isActive) {
      throw new AppError('This email is already being used', 400);
    } else if (!paymentMethods) {
      throw new AppError('Payment method is required', 402);
    } else if (expired(paymentMethods)) {
      throw new AppError('The payment card\'s due date has passed. Please try another method', 400);
    }

    if (user) {
      await this.repository.update(user.id, { isAdm, isActive: true });
      const oldUser = await this.update(user.id, { name, email, password, paymentMethods });
      return oldUser;
    } else {
      const newPayment = this.paymentRepo.create(paymentMethods);
      const savedPayment = await this.paymentRepo.save(newPayment);
  
      const hashedKey = await hash(password, 10);
      const newUser = this.repository.create({ name, email, password: hashedKey, isAdm, paymentMethods: savedPayment });
      const savedUser = await this.repository.save(newUser);
  
      return savedUser;
    }
  }

  static async read(): Promise<Users[]> {
    const usersList = await this.repository.find();
    return usersList;
  }

  static async readById(id: string): Promise<Users> {
    const specificUser = await this.repository.findOneBy({
      id,
      isActive: true,
    });
    if (!specificUser) {
      throw new AppError('User not found', 404);
    }

    return specificUser;
  }

  static async update(
    id: string,
    { name, email, password, paymentMethods }: IUserUpdateRequest
  ): Promise<Users> {
    const user = await this.repository.findOneBy({ id, isActive: true });
    if (!user) {
      throw new AppError('User not found', 404);
    } else if (paymentMethods && partialUpdates(paymentMethods)) {
      throw new AppError(
        'The update of payment method must contain all the following keys: name, cpf, number, dueDate, code',
        400
      );
    }

    let newPayment: PaymentMethods;
    if (paymentMethods) {
      if (expired(paymentMethods)) {
        throw new AppError(
          "The payment card's due date has passed. Please try another method",
          400
        );
      }

      const updatePayment = this.paymentRepo.create(paymentMethods);
      newPayment = await this.paymentRepo.save(updatePayment);
    }

    await this.repository.update(id, {
      name: name ? name : user.name,
      email: email ? email : user.email,
      password: password ? await hash(password, 10) : user.password,
      paymentMethods: newPayment! ? newPayment : user.paymentMethods,
    });
    newPayment! &&
      (await this.paymentRepo.delete({ id: user.paymentMethods.id }));
    const updatedUser = await this.repository.findOneBy({ id });

    return updatedUser!;
  }

  static async delete(id: string) {
    const user = await this.repository.findOneBy({ id, isActive: true });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await this.repository.update(id, {
      isActive: false,
    });
  }
}
