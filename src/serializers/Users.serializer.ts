import * as yup from "yup"
import { v4 as uuidv4 } from "uuid"
import { hashSync } from "bcryptjs"

export const shemaPayment = yup.object().shape({
    id:yup
        .string()
        .default(()=>uuidv4())
        .transform(()=>uuidv4())
        .required(),
    name:yup
        .string()
        .required(),
    cpf:yup
        .string()
        .required(),
    number:yup
        .string()
        .required(),
    dueDate:yup
        .date()
        .required(),
    code:yup
        .string()
        .required(),
})

export const shemaCreateUser = yup.object().shape({
    // id:yup
    //     .string()
    //     .default(()=>uuidv4())
    //     .transform(()=>uuidv4())
    //     .required("Id is requerid"),
    name:yup
        .string()
        .required("Name is requerid"),
    email:yup
        .string()
        .email("Email invalid")
        .required("Email is requerid"),
    isAdm:yup
        .boolean()
        .default(()=>false)
        .required("IsAdm is requerid"),
    password:yup
        .string()
        .required("Password is requerid"),
    // createdAt:yup
    //     .date()
    //     .default(()=>new Date)
    //     .transform(()=>new Date)
    //     .required("CreatedAt is requerid"),
    // updatedAt:yup
    //     .date()
    //     .default(()=>new Date)
    //     .transform(()=>new Date)
    //     .required("UpdatedAt is requerid"),
    paymentMethods:shemaPayment
})

