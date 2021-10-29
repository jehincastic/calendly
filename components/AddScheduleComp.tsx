import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TodayIcon from "@mui/icons-material/Today";

import Button from "@components/Button";
import { ScheduleCompProps, SheduleDataDisplay } from "@interfaces/index";
import AddScheduleTab from "@components/AddScheduleTab";

interface AddScheduleCompProps extends ScheduleCompProps {}

const AddScheduleComp: React.FC<AddScheduleCompProps> = ({
  schedule,
  setScheduleData,
}) => {

  return (
    <Container component="main" maxWidth="md">
      <Typography
        component="h5"
        variant="h5"
        sx={{
          mb: 5,
        }}
      >
        Set your availability
      </Typography>
      <Typography
        variant="body2"
      >
        Choose a schedule below to edit or create a new one that
        {" "}you can apply to your event types
      </Typography>
      <Typography
        variant="button"
        display="block"
        gutterBottom
        sx={{
          mt: 2,
          mb: 2,
        }}
      >
        SCHEDULE NAME
      </Typography>
      <Button
        variant="outlined"
        startIcon={<TodayIcon sx={{ width: 24 }} />}
        sx={{
          borderColor: "#D0D0D0",
          color: "#1A1A1A",
          textTransform: "none",
          fontWeight: "bold",
          mb: 3,
          ":hover": {
            borderColor: "#B4B5B7",
          }
        }}
      >
        {schedule.name}
      </Button>
      <AddScheduleTab
        schedule={schedule}
        setScheduleData={setScheduleData}
      />
    </Container>
  );
};

export default AddScheduleComp;
