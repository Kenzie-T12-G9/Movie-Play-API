import * as yup from 'yup';

export const schemaIinitSession = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
}).noUnknown(true).strict();
