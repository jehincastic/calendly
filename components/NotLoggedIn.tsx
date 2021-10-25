import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";

import Button from "@components/Button";

const NotLoggedIn: React.FC = () => {
  const router = useRouter();
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
        <Typography
          component="h1"
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          Welcome to {process.env.appName}
        </Typography>
        <Typography
          component="div"
          variant="body1"
          sx={{
            textAlign: "center",
          }}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium, vel vitae? Alias obcaecati minus pariatur molestiae officia accusamus, quas magni commodi, cum, quod id. Labore quas optio cumque animi dolor.
        </Typography>
        <Button
          sx={{
            mt: 2,
          }}
          onClick={() => {
            router.push("/signup");
          }}
        >
            Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default NotLoggedIn;
