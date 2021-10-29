import * as React from "react";
import addWeeks from "date-fns/addWeeks";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DateRange } from "@mui/lab/DateRangePicker";
import MobileDateRangePicker from "@mui/lab/MobileDateRangePicker";
import Box from "@mui/material/Box";

const getWeeksAfter = (date: Date | null, amount: number) => {
  return date ? addWeeks(date, amount) : undefined;
}

interface DateRangePickerProps {
  value: DateRange<Date>;
  setValue: (val: DateRange<Date>) => void;
}

const DateRangePickerComp: React.FC<DateRangePickerProps> = ({
  value,
  setValue,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDateRangePicker
        disablePast
        value={value}
        maxDate={getWeeksAfter(value[0], 12)}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        inputFormat="dd/MM/yyyy"
        renderInput={(startProps, endProps) => (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "baseline",
            }}
          >
            <TextField fullWidth {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField fullWidth {...endProps} />
          </Box>
        )}
      />
    </LocalizationProvider>
  );
}

export default DateRangePickerComp;
