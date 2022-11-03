import * as yup from 'yup';

export const shemaPayment = yup.object().shape({
  name: yup.string().required(),
  cpf: yup.string().required(),
  number: yup.string().required(),
  dueDate: yup.string().matches(/\d{4}-\d{2}-\d{2}/, "dueDate attribute must be in the standart Date format (yyyy-mm-dd)").required(),
  code: yup.string().required(),
}).noUnknown(true).strict();

export const shemaCreateUser = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  isAdm: yup.boolean().required(),
  password: yup.string().required(),
  paymentMethod: shemaPayment,
}).noUnknown(true).strict();
