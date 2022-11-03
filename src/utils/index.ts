import { IPaymentInfo } from '../interfaces/users';

export const expired = ({ dueDate }: IPaymentInfo) => {
  const now = new Date();
  const paymentDate = new Date(dueDate);

  return paymentDate.valueOf() - now.valueOf() <= 0;
};
// prettier-ignore
export const partialUpdates = ({ code, cpf, dueDate, name, number }: IPaymentInfo) => {
  return !code || !cpf || !dueDate || !name || !number;
};
