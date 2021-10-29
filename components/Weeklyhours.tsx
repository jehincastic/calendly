import React, { useContext } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useRouter } from "next/router";

import { ScheduleCompProps, ScheduleInput, WeekDays } from "@interfaces/index";
import SingleWeekDay from "@components/SingleWeekDay";
import Button from "@components/Button";
import { LoadingContext } from "@providers/LoadingProvider";
import { validateWeeklyHours } from "@utils/index";
import { AlertContext } from "@providers/AlertProvider";
import fetcher from "@utils/fetcher";

interface WeeklyhoursProps extends ScheduleCompProps {};

const Weeklyhours: React.FC<WeeklyhoursProps> = ({
  schedule,
  setScheduleData,
}) => {
  const router = useRouter();
  const { isLoading, setLoading } = useContext(LoadingContext);
  const { setAlertInfo } = useContext(AlertContext);
  
  const handleSave = async () => {
    setLoading(true);
    const isValid = validateWeeklyHours(schedule.weeklyHours);
    if (!isValid) {
      setAlertInfo({
        msg: "Validation Failed. Please check all dates.",
        severity: "error",
      });
      setLoading(false);
    } else {
      const {
        status,
        data,
      } = await fetcher<ScheduleInput, string>(
        `/api/upsert-schedule`,
        "POST",
        schedule,
      );
      if (status === "FAILED") {
        setAlertInfo({
          msg: data as string,
          severity: "error",
        });
        setLoading(false);
      } else {
        router.push("/schedule");
      }
    }
  };
  
  return (
    <Container
      sx={{
        mt: 2,
        mb: 2,
      }}
    >
      <div
        style={{
          marginBottom: "32px",
        }}
      >
        <Typography
          variant="button"
          sx={{
            textTransform: "none",
            fontSize: 16,
            mb: 4,
          }}
        >
          Set your weekly hours (By 15 mins)
        </Typography>
      </div>
      {
        Object.values(WeekDays).map((day, i) => 
          <SingleWeekDay
            schedule={schedule}
            setScheduleData={setScheduleData}
            key={i}
            day={day}
          />
        )
      }
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button onClick={handleSave} loading={isLoading}>
          Save Schedule
        </Button>
      </div>
    </Container>
  );
};

export default Weeklyhours;
