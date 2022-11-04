import * as yup from 'yup';

export const shemaUpdateEpisodes = yup.object().shape({
  season: yup.number().notRequired(),
  episode: yup.number().notRequired(),
  name: yup.string().notRequired(),
  duration: yup.number().notRequired(),
  description: yup.string().notRequired(),
}).noUnknown(true).strict();
