import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { TimezoneOption } from "@interfaces/index";
import { getTimeDiff } from "@utils/index";

interface TimezoneSelectProps {
  handleChange: (timezone: TimezoneOption | null) => void;
  timezones: TimezoneOption[];
  timezone: TimezoneOption | null;
}

const TimezoneSelect: React.FC<TimezoneSelectProps> = ({
  handleChange,
  timezones,
  timezone,
}) => {
  return (
    <Autocomplete
      options={timezones}
      autoHighlight
      value={timezone}
      getOptionLabel={(option) => option.zoneName}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option.zoneName} {getTimeDiff(option.gmtOffset)}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          required
          {...params}
          value={timezone}
          label="Choose a timezone"
          inputProps={{
            ...params.inputProps,
          }}
        />
      )}
      onChange={(_, val) => {
        handleChange(val);
      }}
    />
  );
};

export default TimezoneSelect;
