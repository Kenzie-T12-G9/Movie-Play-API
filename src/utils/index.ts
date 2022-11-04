import { IPaymentInfo } from '../interfaces/users';

export const expired = ({ dueDate }: IPaymentInfo) => {
  const now = new Date();
  const paymentDate = new Date(dueDate);
  const BRT = 10800000;

  return paymentDate.valueOf() - (now.valueOf() - BRT) <= 0;
};
// prettier-ignore
export const partialUpdates = ({ code, cpf, dueDate, name, number }: IPaymentInfo) => {
  return !code || !cpf || !dueDate || !name || !number;
};
