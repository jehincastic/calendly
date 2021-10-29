import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { EventsDisplayAll } from "@interfaces/index";
import Button from "@components/Button";
import EventListCard from "@components/EventListCard";

interface EventsListProps {
  events: EventsDisplayAll[];
  handleBtnClick: () => void;
  username: string;
}

const EventsList: React.FC<EventsListProps> = ({
  events,
  handleBtnClick,
  username,
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
          events.map((event, idx) => {
            return (
              <Grid key={idx} item xs={12} sm={6} md={3}>
                <EventListCard username={username} event={event} />
              </Grid>
            );
          })
        }
      </Grid>
      <Button
        sx={{
          mt: 2,
        }}
        onClick={() => handleBtnClick()}
      >
        Add New Event
      </Button>
    </Box>
  );
};

export default EventsList;
