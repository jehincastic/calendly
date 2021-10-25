import * as yup from "yup";

export const emailRequiredSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid Email.")
    .required("Email is Required."),
});

export const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid Email."),
});
