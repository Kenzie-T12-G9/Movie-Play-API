import * as yup from "yup"
import { v4 as uuidv4 } from "uuid"

export const shemaCreateSerie = yup.object().shape({
    id:yup
        .string()
        .default(()=>uuidv4())
        .transform(()=>uuidv4())
        .required("Id is requerid"),
    name:yup
        .string()
        .required("Name is requerid"),
    year:yup
        .date()
        .required("Year is requerid"),
    description:yup
        .string()
        .required("Description is requerid"),
    direction:yup
        .string()
        .required("Direction is requerid"),
})

export const shemaUpdateSerie = yup.object().shape({
    name:yup
        .string()
        .notRequired(),
    year:yup
        .date()
        .notRequired(),
    description:yup
        .string()
        .notRequired(),
    direction:yup
        .string()
        .notRequired(),
})

export const shemaAddEpisodeoSerie = yup.object().shape({
    id:yup
        .string()
        .default(()=>uuidv4())
        .transform(()=>uuidv4())
        .required("Id is requerid"),
    season:yup
        .number()
        .required("Season is requerid"),
    episode:yup
        .number()
        .required("Episode is requerid"),
    name:yup
        .string()
        .required("Name is requerid"),
    duration:yup
        .number()
        .required("Duration is requerid"),
    description:yup
        .string()
        .required("Description is requerid"),
})