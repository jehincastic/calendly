import * as React from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import countries from "@config/countries";
import { CountryOption } from "@interfaces/index";

interface CountrySelectProps {
  handleChange: (country: CountryOption | null) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ handleChange }) => {
  return (
    <Autocomplete
      options={countries}
      autoHighlight
      getOptionLabel={(option) => option.label}
      renderOption={(props, option) => (
        <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
          <Image
            loading="lazy"
            width="20"
            height="13.33"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            alt=""
          />
          &nbsp;
          &nbsp;
          {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          required
          {...params}
          label="Choose a country"
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

export default CountrySelect;
