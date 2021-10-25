import * as yup from "yup";

import { emailRequiredSchema } from "@schemas/email";

const loginSchema = emailRequiredSchema.concat(
  yup.object().shape({
    password: yup
      .string()
      .min(8, "Must be at least 8 characters.")
      .required("Password is Required."),
  })
);

export default loginSchema;
