import * as yup from "yup"

export const schemaCreateMovie = yup.object().shape({
    name:yup
        .string()
        .required("Name is required"),
    year:yup
        .string()
        .required("Year is required"),
    duration:yup
        .number()
        .required("Duration is required"),
    description:yup
        .string()
        .required("Description is required"),
    direction:yup
        .string()
        .required("Description is required")
})