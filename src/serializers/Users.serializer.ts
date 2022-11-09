import * as yup from 'yup';

export const shemaPayment = yup.object().shape({
  name: yup.string().required(),
  cpf: yup.string().required(),
  number: yup.string().required(),
  dueDate: yup.string().matches(/\d{4}-\d{2}-\d{2}/, "dueDate attribute must be in the standart Date format (yyyy-mm-dd)").required(),
  code: yup.string().required(),
}).noUnknown(true).strict();

export const shemaPaymentUpdate = yup.object().shape({
  name: yup.string().notRequired(),
  cpf: yup.string().notRequired(),
  number: yup.string().notRequired(),
  dueDate: yup.string().matches(/\d{4}-\d{2}-\d{2}/, "dueDate attribute must be in the standart Date format (yyyy-mm-dd)").notRequired(),
  code: yup.string().notRequired(),
}).noUnknown(true).strict();

export const shemaCreateUser = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  isAdm: yup.boolean().required(),
  password: yup.string().required(),
  paymentMethods: shemaPayment,
}).noUnknown(true).strict();

export const shemaUpdateUser = yup.object().shape({
  name: yup.string().notRequired(),
  email: yup.string().email().notRequired(),
  isAdm: yup.boolean().notRequired(),
  password: yup.string().notRequired(),
  paymentMethods: shemaPaymentUpdate,
}).noUnknown(true).strict();

const schemaPaymentMethod = yup.object().shape({
  id:yup  
    .string()
    .notRequired(),
  name:yup  
    .string()
    .notRequired(),
  cpf:yup  
    .string()
    .notRequired(),
  number:yup  
    .string()
    .notRequired(),
  dueDate:yup  
    .string()
    .notRequired(),
  code:yup  
    .string()
    .notRequired(),
})

const schemUser = yup.object().shape({
  id:yup  
    .string()
    .notRequired(),
  name:yup  
    .string()
    .notRequired(),
  email:yup  
    .string()
    .notRequired(),
  createdAt:yup  
    .string()
    .notRequired(),
  updatedAt:yup  
    .string()
    .notRequired(),
  paymentMethods:schemaPaymentMethod
  
})

export const schemaResSession = yup.object().shape({
    user:schemUser,
    token:yup
      .string()
      .notRequired()
})