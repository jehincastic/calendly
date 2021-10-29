import type { NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Form, Formik } from "formik";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import { LockOutlined, DraftsOutlined } from "@mui/icons-material";

import { useAuth } from "@providers/AuthProvider";
import signUpSchema from "@schemas/signup";
import Button from "@components/Button";
import { AlertContext } from "@providers/AlertProvider";
import fetcher from "@utils/fetcher";
import { CountryOption, SignUpInput, TimezoneOption } from "@interfaces/index";
import CountrySelect from "@components/CountriesSelect";
import TimezoneSelect from "@components/TimezoneSelect";
import { LoadingContext } from "@providers/LoadingProvider";

type SignUpForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  receiveMail: boolean;
};

const ConfirmScreen: React.FC<{ email: string }> = ({ email }) => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <DraftsOutlined sx={{ fontSize: "200px" }} />
        <Typography
          component="h1"
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          Email Confirmation
        </Typography>
        <Typography
          component="div"
          variant="body1"
          sx={{
            textAlign: "center",
          }}
        >
          We have sent email to <span style={{ fontWeight: 700 }}>{email}</span> to confirm your identity.
          After receving the email follow the link provided to complete the registration.
        </Typography>
      </Box>
    </Container>
  );
};

const Signup: NextPage = () => {
  const [userEmail, setEmail] = useState("");
  const [country, setCountry] = useState<CountryOption | null>(null);
  const [timezone, setTimezone] = useState<TimezoneOption | null>(null);
  const [timezones, setTimezones] = useState<TimezoneOption[]>([]);
  const [signedUp, setSignedUp] = useState(false);
  const { user } = useAuth();
  const { setAlertInfo } = useContext(AlertContext);
  const { setLoading } = useContext(LoadingContext);
  const router = useRouter();

  useEffect(() => {
    if (user.loggedIn) {
      router.push("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    if (timezones.length > 0) {
      setTimezones([]);
      setTimezone(null);
    }
    if (country) {
      setLoading(true);
      fetcher<any, TimezoneOption[] | string>(`/api/get-timezone?country=${country.code}`, "POST")
        .then(({
          status,
          data,
        }) => {
          if (status === "FAILED") {
            setAlertInfo({
              msg: data as string,
              severity: "error",
            });
          } else {
            const timezoneData = data as TimezoneOption[];
            setTimezones(timezoneData);
            if (timezoneData.length === 1) {
              setTimezone(timezoneData[0]);
            }
          }
        })
        .finally(() => {
          setLoading(false);
        })
    }
  }, [country])

  const signUpFn = async (formVal: SignUpForm) => {
    if (formVal.receiveMail && country && timezone) {
      const input: SignUpInput = {
        firstName: formVal.firstName,
        lastName: formVal.lastName,
        email: formVal.email,
        password: formVal.password,
        country: country.label,
        timezone: timezone.zoneName,
        timezoneDiff: timezone.gmtOffset.toString(),
      };
      const response = await fetcher<SignUpInput, string>(
        "/api/signup",
        "POST",
        input,
      );
      if (response.status === "FAILED") {
        setAlertInfo({
          msg: response.data,
          severity: "error",
        })
      } else {
        // Handle Success Case
        setEmail(formVal.email);
        setSignedUp(true);
      }
      return true;
    }
    if (!country) {
      setAlertInfo({
        msg: "Please choose a Country.",
        severity: "error",
      });
    }
    if (!timezone) {
      setAlertInfo({
        msg: "Please choose a Timezone.",
        severity: "error",
      });
    }
    if (!formVal.receiveMail) {
      setAlertInfo({
        msg: "Please accept the terms and conditions.",
        severity: "error",
      });
    }
    return false;
  };

  return (
    signedUp
      ? <ConfirmScreen email={userEmail} />
      : (
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Formik
              initialValues={{
                email: "",
                firstName: "",
                lastName: "",
                password: "",
                receiveMail: false,
              }}
              validationSchema={signUpSchema}
              onSubmit={async (values, actions) => {
                await signUpFn(values);
                actions.setSubmitting(false);
              }}
            >
              {({
                handleChange,
                values,
                touched,
                errors,
                isSubmitting,
                handleBlur,
              }) => (
                <Form>
                  <Grid
                    spacing={2}
                    sx={{ mt: 2 }}
                    container
                  >
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        fullWidth
                        disabled={isSubmitting}
                        onBlur={handleBlur}
                        error={touched.firstName && Boolean(errors.firstName)}
                        id="firstName"
                        label="First Name"
                        type="text"
                        value={values.firstName}
                        onChange={(e) => handleChange(e)}
                        helperText={touched.firstName && errors.firstName}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        fullWidth
                        disabled={isSubmitting}
                        onBlur={handleBlur}
                        error={touched.lastName && Boolean(errors.lastName)}
                        id="lastName"
                        label="Last Name"
                        type="text"
                        value={values.lastName}
                        onChange={(e) => handleChange(e)}
                        helperText={touched.lastName && errors.lastName}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        disabled={isSubmitting}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        id="email"
                        label="Email"
                        type="email"
                        value={values.email}
                        onChange={(e) => handleChange(e)}
                        helperText={touched.email && errors.email}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        disabled={isSubmitting}
                        onBlur={handleBlur}
                        error={touched.password && Boolean(errors.password)}
                        id="password"
                        label="Password"
                        type="password"
                        value={values.password}
                        onChange={(e) => handleChange(e)}
                        helperText={touched.password && errors.password}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <CountrySelect
                        handleChange={(val) => {
                          setCountry(val);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <TimezoneSelect
                        handleChange={(val) => {
                          setTimezone(val);
                        }}
                        timezone={timezone}
                        timezones={timezones}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="allowExtraEmails"
                            color="primary"
                            name="receiveMail"
                            disabled={isSubmitting}
                            onChange={(e) => handleChange(e)}
                          />
                        }
                        label="I agree to terms and conditions."
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    loading={isSubmitting}
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign Up
                  </Button>
                </Form>
              )}
            </Formik>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <NextLink href="/login" passHref>
                  <Link variant="body2">
                    Already have an account? Sign in
                  </Link>
                </NextLink>
              </Grid>
            </Grid>
          </Box>
        </Container>
      )
  );
};

export default Signup;
