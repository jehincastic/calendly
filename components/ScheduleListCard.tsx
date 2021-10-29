import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { format } from "date-fns";

import Button from "@components/Button";
import { SheduleDataAllDisplay } from "@interfaces/index";
import { useAuth } from "@providers/AuthProvider";
import { LoadingContext } from "@providers/LoadingProvider";

interface ScheduleListCardProps {
  schedule: SheduleDataAllDisplay;
}

const ScheduleListCard: React.FC<ScheduleListCardProps> = ({
  schedule,
}) => {
  const { user } = useAuth();
  const { isLoading } = React.useContext(LoadingContext);
  const router = useRouter();

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Typography sx={{ mb: 1.5 }} variant="h6" component="div">
          {schedule.name}
        </Typography>
        <Typography variant="button" sx={{ mb: 1.5 }} color="text.secondary">
          Created on {format(
            new Date(schedule.createdAt),
            "do  MMM  yy @ hh:mm a"
          )}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          loading={user.loading || isLoading}
          onClick={() => {
            router.push(`/schedule/${schedule.id}`);
          }}
          size="small"
        >
          Edit Schedule
        </Button>
      </CardActions>
    </Card>
  );
};

export default ScheduleListCard;
