import * as yup from 'yup';

export const shemaCreateSerie = yup.object().shape({
  id: yup.string().required(),
  name: yup.string().required(),
  year: yup.date().required(),
  description: yup.string().required(),
  direction: yup.string().required(),
}).noUnknown(true).strict();

export const shemaUpdateSerie = yup.object().shape({
  name: yup.string().notRequired(),
  year: yup.date().notRequired(),
  description: yup.string().notRequired(),
  direction: yup.string().notRequired(),
}).noUnknown(true).strict();

export const shemaAddEpisodeoSerie = yup.object().shape({
  id: yup.string().required(),
  season: yup.number().required(),
  episode: yup.number().required(),
  name: yup.string().required(),
  duration: yup.number().required(),
  description: yup.string().required(),
}).noUnknown(true).strict();

