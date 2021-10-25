import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Button from "@components/Button";

interface NoRecordsProps {
  btnName: string;
  title: string;
  subTitle: string;
  btnClick: () => (Promise<void> | void)
}

const NoRecords: React.FC<NoRecordsProps> = ({
  btnClick,
  btnName,
  title,
  subTitle,
}) => {
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
          {title}
        </Typography>
        <Typography
          component="div"
          variant="body1"
          sx={{
            textAlign: "center",
          }}
        >
          {subTitle} 
        </Typography>
        <Button
          sx={{
            mt: 2,
          }}
          onClick={() => btnClick()}
        >
          {btnName}
        </Button>
      </Box>
    </Container>
  );
};

export default NoRecords;
