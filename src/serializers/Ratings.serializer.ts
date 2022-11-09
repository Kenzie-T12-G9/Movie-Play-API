import * as yup from "yup"

export const schemaCreateRating = yup.object().shape({
    rate: yup.number().required(),
    comment: yup.string().max(240).required(),
    userId: yup.string().required()
}).noUnknown(true).strict()