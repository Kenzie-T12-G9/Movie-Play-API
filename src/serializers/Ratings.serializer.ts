import * as yup from "yup"

export const schemaCreateRating = yup.object().shape({
    rate: yup.number(),
    comment: yup.string().length(240),
})