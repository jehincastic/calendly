import * as yup from "yup";

const eventSchema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[A-Za-z ]*$/, "Please enter valid name")
    .max(40)
    .required("Name is Required."),
  link: yup
    .string()
    .matches(/^[A-Za-z ]*$/, "Please enter valid link")
    .max(40)
    .required("Link is Required."),
  type: yup
    .string()
    .matches(/^[A-Za-z ]*$/, "Please select valid type")
    .max(40)
    .required("Type is Required."),
  isPrivate: yup.boolean(),
  password: yup
    .string()
    .when("isPrivate", {
      is: true,
      then: yup
        .string()
        .min(8, "Secret Key Should Be Atleast 8 Characters")
        .required("Must enter Secret Key")
    }),
  duration: yup
    .number()
    .positive("Enter valid duration")
    .integer("Enter valid duration")
    .required("Duaration is Required."),
  durationVal: yup
    .string()
    .matches(/^[A-Za-z ]*$/, "Please select valid duration type")
    .max(40)
    .required("Duration Type is Required."),
  scheduleId: yup
    .string()
    .max(40)
    .required("Schedule is Required."),
});

export default eventSchema;
