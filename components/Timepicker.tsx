import React, { useState } from "react";
import TextField from "@mui/material/TextField";

import { hourWithoutAm, isTimeValid } from "@utils/index";

interface TimepickerProps {
  value: string;
  handleChange: (time: string) => void;
  max: string;
  min: string;
}

const Timepicker: React.FC<TimepickerProps> = ({
  value,
  handleChange,
  max,
  min,
}) => {
  const [isError, setIsError] = useState(false);
  return (
    <TextField
      value={value}
      onChange={(e) => {
        try {
          if (e.target.value) {
            if (!isTimeValid(max, min, e.target.value)) {
              setIsError(true);
            } else {
              setIsError(false);
            }
            const time = hourWithoutAm(e.target.value)
            handleChange(time);
          }
        } catch(err) {
          console.log(err);
        }
      }}
      inputProps={{
        max,
        min,
        step: 60 * 15,
      }}
      type="time"
      error={isError}
      helperText={isError && "Invalid Time"}
      sx={{
        width: "100px",
      }}
    />
  );
};

export default Timepicker;
