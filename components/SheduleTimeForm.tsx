import React from "react";
import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { ScheduleSlot } from "@interfaces/index";
import Timepicker from "@components/Timepicker";
import { hourWithAm } from "@utils/index";

interface SheduleTimeFormProps {
  schedules: ScheduleSlot[];
  updateTime: (idx: number, value: string, type: "start" | "end") => void;
  deleteSlot: (idx: number) => void;
}

const SheduleTimeForm: React.FC<SheduleTimeFormProps> = ({
  schedules,
  updateTime,
  deleteSlot,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {
        schedules.map((s, i) => {
          return (
            <Box
              key={i}
              sx={{
                display: "flex",
                flexDirection: "row",
                mt: 2,
              }}
            >
              <Timepicker
                value={hourWithAm(s.start)}
                handleChange={(time) => updateTime(i, time, "start")}
                min={
                  i !== 0
                  ? hourWithAm(schedules[i - 1].end)
                  : "00:00"
                }
                max={hourWithAm(s.end)}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "light",
                  alignSelf: "center",
                  mx: 2,
                }}
              >
                -
              </Typography>
              <Timepicker
                value={hourWithAm(s.end)}
                handleChange={(time) => updateTime(i, time, "end")}
                min={hourWithAm(s.start)}
                max={
                  schedules.length > (i + 1)
                    ? hourWithAm(schedules[i + 1].start)
                    : "23:45"
                }
              />
              <IconButton
                sx={{
                  ml: 3,
                }}
                aria-label="delete"
                onClick={() => deleteSlot(i)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          );
        })
      }
    </Box>
  );
};

export default SheduleTimeForm;
