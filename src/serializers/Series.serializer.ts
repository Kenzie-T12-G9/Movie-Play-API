import * as yup from 'yup';

export const shemaCreateSerie = yup.object().shape({
  name: yup.string().required(),
  year: yup.string().max(4, "Maximum of 4 digits").required("Year is requerid"),
  description: yup.string().required(),
  direction: yup.string().required(),
}).noUnknown(true).strict();

export const shemaUpdateSerie = yup.object().shape({
  name: yup.string().notRequired(),
  year: yup.string().max(4, "Maximum of 4 digits").notRequired(),
  description: yup.string().notRequired(),
  direction: yup.string().notRequired(),
}).noUnknown(true).strict();

export const shemaAddEpisodeoSerie = yup.object().shape({
  season: yup.number().required(),
  episode: yup.number().required(),
  name: yup.string().required(),
  duration: yup.number().required(),
  description: yup.string().required(),
}).noUnknown(true).strict();

