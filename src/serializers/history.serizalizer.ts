import * as yup from "yup"

export const schemaCreateHistory = yup.object().shape({
    watchedAt:yup   
        .date()
        .default(() => new Date())
        .transform(() => new Date())
        .notRequired(),
    serieId:yup   
        .string()
        .matches(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i, "Must be a v4 UUID")
        .notRequired(),
    movieId:yup   
        .string()
        .matches(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i, "Must be a v4 UUID")
        .notRequired(),
})