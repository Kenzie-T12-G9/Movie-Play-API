import * as yup from 'yup';

export const schemaCreateHistory = yup.object().shape({
  watchedAt: yup
    .date()
    .default(() => new Date())
    .transform(() => new Date())
    .notRequired(),
  seriesId: yup
    .string()
    .matches(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
      'Must be a v4 UUID'
    )
    .notRequired(),
  movieId: yup
    .string()
    .matches(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
      'Must be a v4 UUID'
    )
    .notRequired(),
});

export const schemaResponseSeriesHistory = yup.object().shape({
  id: yup.string().notRequired(),
  name: yup.string().notRequired(),
  year: yup.string().notRequired(),
  description: yup.string().notRequired(),
  direction: yup.string().notRequired(),
});

export const schemaResponseMovieHistory = yup.object().shape({
  id: yup.string().notRequired(),
  name: yup.string().notRequired(),
  year: yup.string().notRequired(),
  duration: yup.number().notRequired(),
  description: yup.string().notRequired(),
  direction: yup.string().notRequired(),
});

export const schemaResponseUserHistory = yup.object().shape({
  id: yup.string().notRequired(),
  name: yup.string().notRequired(),
  email: yup.string().notRequired(),
});

export const schemaResMovie = yup.object().shape({
  watchedAt: yup.date().required(),
  id: yup.string().required(),
  movie: schemaResponseMovieHistory,
  user: schemaResponseUserHistory,
});

export const schemaResListMovie = yup.object().shape({
  watchedAt: yup.date().required(),
  id: yup.string().required(),
  movie: schemaResponseMovieHistory,
});

export const schemaResSerie = yup.object().shape({
  watchedAt: yup.date().required(),
  id: yup.string().required(),
  series: schemaResponseSeriesHistory,
  user: schemaResponseUserHistory,
});

export const schemaResListSerie = yup.object().shape({
  watchedAt: yup.date().required(),
  id: yup.string().required(),
  series: schemaResponseSeriesHistory,
});

export const schemaResHistory = yup.object().shape({
  watchedAt: yup.date().required(),
  id: yup.string().required(),
  series: schemaResponseSeriesHistory.nullable(),
  movie: schemaResponseMovieHistory.nullable(),
});

export const schemaResActivity = yup.object().shape({
  watchedAt: yup.date().required(),
  id: yup.string().required(),
  user: schemaResponseUserHistory,
});

export const arrayResMovie = yup.array(schemaResListMovie);
export const arrayResSeries = yup.array(schemaResListSerie);

export const arrayResHistory = yup.array(schemaResHistory);

const resMovieActive = yup.array(schemaResActivity);

export const movieIdResponse = yup.object().shape({
  movie: schemaResponseMovieHistory,
  activity: resMovieActive,
});

const resSeriesActive = yup.array(schemaResActivity);

export const seriesIdResponse = yup.object().shape({
  series: schemaResponseSeriesHistory,
  activity: resSeriesActive,
});
