import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Button from "@components/Button";
import { SheduleDataAllDisplay } from "@interfaces/index";
import ScheduleListCard from "@components/ScheduleListCard";

interface ScheduleListProps {
  schedules: SheduleDataAllDisplay[];
  handleClick: () => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  handleClick,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Grid
        spacing={4}
        container
        sx={{ mt: 2 }}
      >
        {
          schedules.map((sc, idx) => {
            return (
              <Grid key={idx} item xs={12} sm={6} md={3}>
                <ScheduleListCard schedule={sc} />
              </Grid>
            );
          })
        }
      </Grid>
      <Button
        sx={{
          mt: 2,
        }}
        onClick={() => handleClick()}
      >
        Add New Schedule
      </Button>
    </Box>
  );
};

export default ScheduleList;
