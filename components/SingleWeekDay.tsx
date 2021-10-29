import React, { useContext } from "react";
import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";

import { ScheduleCompProps, ScheduleSlot, WeekDays } from "@interfaces/index";
import SheduleTimeForm from "@components/SheduleTimeForm";
import { AlertContext } from "@providers/AlertProvider";
import { hourWithAm, hourWithoutAm } from "@utils/index";

interface SingleWeekDayProps extends ScheduleCompProps {
  day: WeekDays;
};

const SingleWeekDay: React.FC<SingleWeekDayProps> = ({
  schedule,
  day,
  setScheduleData,
}) => {
  const { setAlertInfo } = useContext(AlertContext);
  
  const deleteSlot = (idx: number) => {
    const newSchedule = {...schedule};
    const dayData = newSchedule.weeklyHours[day];
    dayData.schedule = dayData.schedule.filter((d, i) => i !== idx);
    if (dayData.schedule.length === 0) {
      dayData.active = false;
    }
    setScheduleData(newSchedule);
  };

  const handleCheckBoxChange = () => {
    const newSchedule = {...schedule};
    const dayData = newSchedule.weeklyHours[day];
    if (dayData.active) {
      dayData.active = false;
      dayData.schedule = [];
    } else {
      dayData.active = true;
      dayData.schedule = [{
        start: "09:00 AM",
        end: "05:00 PM"
      }];
    }
    setScheduleData(newSchedule);
  };

  const addNewTimeRange = () => {
    const newSchedule = {...schedule};
    const dayData = newSchedule.weeklyHours[day];
    const lastData = dayData.schedule[dayData.schedule.length - 1];
    const endTime = hourWithAm(lastData.end);
    const [startHour, startMinute] = endTime.split(":").map(e => Number(e));
    if ((startHour + 1) < 24) {
      const newData: ScheduleSlot = {
        start: hourWithoutAm(`${startHour + 1}:${startMinute}`),
        end: hourWithoutAm(`${startHour + 2}:${startMinute}`),
      };
      dayData.schedule.push(newData);
      setScheduleData(newSchedule);
    } else {
      setAlertInfo({
        msg: "Invalid Addition",
        severity: "error",
      });
    }

  };

  const updateTime = (
    idx: number,
    value: string,
    type: "start" | "end",
  ) => {
    const newSchedule = {...schedule};
    const dayData = newSchedule.weeklyHours[day];
    dayData.schedule[idx][type] = value;
    setScheduleData(newSchedule);
  };

  const {
    active,
    schedule: data,
  } = schedule.weeklyHours[day];
  return (
    <Box
      sx={{
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex"
          }}
        >
          <Checkbox
            checked={active}
            onChange={handleCheckBoxChange}
            inputProps={{ "aria-label": "controlled" }}
          />

          <Typography
            sx={{
              fontWeight: "bold",
              alignSelf: "center",
            }}
            variant="button"
          >
            {day.toString()}
          </Typography>
        </Box>
        <IconButton
          aria-label="add"
          onClick={addNewTimeRange}
          disabled={
            !active ||
            Number(hourWithAm(data[data.length - 1].end)?.split?.(":")?.[0]) === 23
          }
        >
          <AddIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          ml: 5,
        }}
      >
        {
          active
            ? (
              <SheduleTimeForm
                schedules={data}
                updateTime={updateTime}
                deleteSlot={deleteSlot}
              />
            ) : (
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "light",
                  alignSelf: "center",
                }}
              >
                Unavailable
              </Typography>
            )
        }
      </Box>
    </Box>
  );
};

export default SingleWeekDay;
