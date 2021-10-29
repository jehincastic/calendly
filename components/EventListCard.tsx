import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";

import Button from "@components/Button";
import { EventsDisplayAll } from "@interfaces/index";
import { useAuth } from "@providers/AuthProvider";
import { LoadingContext } from "@providers/LoadingProvider";

interface EventListCardProps {
  event: EventsDisplayAll;
  username: string;
}

const EventListCard: React.FC<EventListCardProps> = ({
  event,
  username,
}) => {
  const { user } = useAuth();
  const { isLoading } = React.useContext(LoadingContext);
  const router = useRouter();

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          /{username}/{event.link}
        </Typography>
        <Typography variant="h6" component="div">
          {event.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {event.scheduleName}
        </Typography>
        <Typography variant="body2">
          Expies On : {event.endDate}
        </Typography>
      </CardContent>
      <CardActions>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            loading={user.loading || isLoading}
            size="small"
            onClick={() => {}}
          >
            Edit Event
          </Button>
          <Button
            loading={user.loading || isLoading}
            onClick={() => {
              router.push(`/${username}/${event.link}`)
            }}
            size="small"
          >
            Open Event
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default EventListCard;
