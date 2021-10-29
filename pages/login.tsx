import type { NextPage } from "next";
import React, { useContext, useEffect } from "react";
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
import { LockOutlined } from "@mui/icons-material";
import Link from "@mui/material/Link";
import NextLink from "next/link";

import { useAuth } from "@providers/AuthProvider";
import LoginSchema from "@schemas/login";
import Button from "@components/Button";
import { AlertContext } from "@providers/AlertProvider";
import { LoginInput, LoginResponse } from "@interfaces/index";
import fetcher from "@utils/fetcher";
import { getDefaultProfileImg } from "@utils/index";

const Login: NextPage = () => {
  const { user, setUser } = useAuth();
  const { setAlertInfo } = useContext(AlertContext);
  const router = useRouter();

  useEffect(() => {
    if (user.loggedIn) {
      router.push("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loginFn = async (formVal: LoginInput) => {
    const response = await fetcher<LoginInput, LoginResponse | string>(
      "/api/login",
      "POST",
      formVal,
    );
    if (response.status === "FAILED") {
      setAlertInfo({
        msg: response.data as string,
        severity: "error",
      });
    } else {
      const {
        token,
        user: userInfo,
      } = response.data as LoginResponse;
      localStorage.setItem(process.env.tokenKey || "", token);
      setAlertInfo({
        msg: "Logged In Successfully...",
      });
      if (!userInfo.image) {
        userInfo.image = getDefaultProfileImg(`${userInfo.firstName} ${userInfo.lastName}`);
      }
      setUser({
        ...userInfo,
        loggedIn: true,
        loading: false,
      });
    }
    return true;
  };

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
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Formik
          initialValues={{
            email: "",
            password: "",
            rememberMe: false,
          }}
          validationSchema={LoginSchema}
          onSubmit={async (values, actions) => {
            await loginFn(values);
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
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="allowExtraEmails"
                        color="primary"
                        name="rememberMe"
                        disabled={isSubmitting}
                        onChange={(e) => handleChange(e)}
                      />
                    }
                    label="Remember Me."
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
                Sign In
              </Button>
            </Form>
          )}
        </Formik>
        <Grid container>
          <Grid item xs>
            <NextLink href="/signup" passHref>
              <Link variant="body2">
                New Here?
              </Link>
            </NextLink>
          </Grid>
          <Grid item>
            <NextLink href="/forgotpassword" passHref>
              <Link variant="body2">
                Forgot password?
              </Link>
            </NextLink>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Login;
