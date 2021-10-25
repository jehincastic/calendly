import * as yup from "yup";

import loginSchema from "@schemas/login";

const signUpSchema = loginSchema.concat(
  yup.object().shape({
    firstName: yup
      .string()
      .matches(/^[A-Za-z ]*$/, "Please enter valid name")
      .max(40)
      .required("Name is Required."),
    lastName: yup
      .string()
      .matches(/^[A-Za-z ]*$/, "Please enter valid name")
      .max(40)
      .required("Name is Required."),
  })
);


export default signUpSchema;
