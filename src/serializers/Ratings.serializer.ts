import * as yup from 'yup';

export const schemaCreateRating = yup.object().shape({
    rate: yup
      .number()
      .min(1, "Value of argument 'rate' must be an integer between 1 and 5")
      .max(5, "Value of argument 'rate' must be an integer between 1 and 5")
      .required(),
    comment: yup.string().max(240).required(),
    userId: yup.string().required(),
  }).noUnknown(true).strict();
