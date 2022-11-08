import * as yup from "yup"

export const schemaValidIdParams = yup.object().shape({
    id:yup
        .string()
        .matches(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i, "Must be a V4 UUID")
        .required("UUID required")
});

export const schemaValidMovieIdParams = yup.object().shape({
    movieId:yup
        .string()
        .matches(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i, "Must be a V4 UUID")
        .required("UUID required")
});

export const schemaValidSerieIdParams = yup.object().shape({
    serieId:yup
        .string()
        .matches(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i, "Must be a V4 UUID")
        .required("UUID required")
});

export const schemaValidUserIdParams = yup.object().shape({
    userId:yup
        .string()
        .matches(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i, "Must be a V4 UUID")
        .required("UUID required")
});