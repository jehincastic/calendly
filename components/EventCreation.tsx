import React, { useContext, useEffect, useState } from "react";
import { FormikErrors, FormikTouched } from "formik";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import { EventType } from "@prisma/client";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormLabel from "@mui/material/FormLabel";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import dynamic from "next/dynamic";
import { DateRange } from "@mui/lab/DateRangePicker";

import { EventFormSubmit, SheduleDataAllDisplay } from "@interfaces/index";
import fetcher from "@utils/fetcher";
import { AlertContext } from "@providers/AlertProvider";
import { LoadingContext } from "@providers/LoadingProvider";
import DateRangePickerComp from "@components/DateRangePicker";

const RichTextComp = dynamic(
  () => import("@components/Richtext"),
  { ssr: false },
);

interface EventCreationProps {
  email: string;
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | React.ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
  };
  values: EventFormSubmit;
  touched: FormikTouched<EventFormSubmit>;
  errors: FormikErrors<EventFormSubmit>;
  isSubmitting: boolean;
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<EventFormSubmit>>;
}

const optionLabel: {[key in EventType]: string} = {
  "GMEET": "Google Meet",
  "INPERSON": "In Person",
  "PHONE": "Phone",
  "ZOOM": "Zoom",
};

const EventCreation: React.FC<EventCreationProps> = ({
  email,
  handleChange,
  values,
  touched,
  errors,
  isSubmitting,
  handleBlur,
  setFieldValue,
}) => {
  const { setAlertInfo } = useContext(AlertContext);
  const { setLoading } = useContext(LoadingContext);
  const [schedules, setSchedules] = useState<SheduleDataAllDisplay[]>([]);
  
  const getSchedule = async () => {
    setLoading(true);
    const {
      data,
      status,
    } = await fetcher<any, SheduleDataAllDisplay[]>("/api/get-schedule", "get");
    if (status === "SUCCESS") {
      const scheduleData = data as SheduleDataAllDisplay[];
      if (scheduleData.length === 0) {
        setAlertInfo({
          msg: "No Schedule Found Please Add One.",
          severity: "error",
        });
      }
      setSchedules(scheduleData);
    } else {
      setAlertInfo({
        msg: data as string,
        severity: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getSchedule();
  }, []);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Container>
      <Box
        sx={{
          my: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid
          spacing={2}
          sx={{ mt: 2 }}
          container
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              disabled={isSubmitting}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              id="name"
              name="name"
              label="Name"
              type="text"
              value={values.name}
              onChange={(e) => {
                handleChange(e);
                if (!touched.link) {
                  const value = e.target.value.replace(/\s/g, "").toLowerCase();
                  setFieldValue(
                    "link",
                    value,
                  );
                }
              }}
              helperText={touched.name && errors.name}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              disabled={isSubmitting}
              onBlur={handleBlur}
              error={touched.link && Boolean(errors.link)}
              label="Link"
              id="link"
              name="link"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {`${email.split("@")[0]}/`}
                  </InputAdornment>
                ),
              }}
              type="text"
              value={values.link}
              onChange={(e) => handleChange(e)}
              helperText={touched.link && errors.link}
              required
            />
          </Grid>
          <Grid item xs={9} sm={4} md={3}>
            <FormControl
              fullWidth
              required
              error={touched.type && Boolean(errors.type)}
              >
              <InputLabel id="type_label">Type</InputLabel>
              <Select
                labelId="type_label"
                id="type"
                value={values.type}
                label="Type"
                name="type"
                onChange={(e) => handleChange(e)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {
                  Object.values(EventType).map((val, i) => (
                    <MenuItem key={i} value={val}>{optionLabel[val]}</MenuItem>
                  ))
                }
              </Select>
              <FormHelperText>{touched.type && errors.type}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={3} sm={2} md={1}>
            <FormLabel component="legend">Is Approval</FormLabel>
            <Switch
              disabled={isSubmitting}
              onBlur={handleBlur}
              checked={values.isApprovalRequired}
              onChange={e => handleChange(e)}
              id="isApprovalRequired"
              name="isApprovalRequired"
            />
          </Grid>
          <Grid item xs={3} sm={2} md={1}>
            <FormLabel component="legend">Is Private</FormLabel>
            <Switch
              disabled={isSubmitting}
              onBlur={handleBlur}
              checked={values.isPrivate}
              onChange={e => handleChange(e)}
              id="isPrivate"
              name="isPrivate"
            />
          </Grid>
          <Grid item xs={9} sm={4} md={3}>
            <TextField
              fullWidth
              disabled={isSubmitting || !values.isPrivate}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              id="password"
              name="password"
              label="Secret Key"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={(e) => handleChange(e)}
              helperText={touched.password && errors.password}
              required={values.isPrivate}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      disabled={!values.isPrivate}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              disabled={isSubmitting}
              onBlur={handleBlur}
              error={touched.duration && Boolean(errors.duration)}
              id="duration"
              name="duration"
              label="Duration"
              type="number"
              value={values.duration}
              onChange={(e) => handleChange(e)}
              helperText={touched.duration && errors.duration}
              required
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth>
              <InputLabel id="durtype_label">Duration Type</InputLabel>
              <Select
                labelId="durtype_label"
                id="durationVal"
                value={values.durationVal}
                label="Duration Value"
                name="durationVal"
                onChange={(e) => handleChange(e)}
              >
                <MenuItem value="min">Minutes</MenuItem>
                <MenuItem value="hour">Hours</MenuItem>
              </Select>
              <FormHelperText>{touched.durationVal && errors.durationVal}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <FormControl
              fullWidth
              error={touched.scheduleId && Boolean(errors.scheduleId)}
            >
              <InputLabel required id="schedule_label">Schedule</InputLabel>
              <Select
                labelId="schedule_label"
                id="scheduleId"
                value={values.scheduleId}
                label="Schedule"
                name="scheduleId"
                onChange={(e) => handleChange(e)}
              >
                {
                  schedules.map((s, i) => (
                    <MenuItem key={i} value={s.id}>{s.name}</MenuItem>
                  ))
                }
              </Select>
              <FormHelperText>{touched.scheduleId && errors.scheduleId}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DateRangePickerComp
              value={values.dateRange as DateRange<Date>}
              setValue={(val) => setFieldValue("dateRange", val)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <FormLabel component="legend">Description / Instructions</FormLabel>
            <RichTextComp
              value={values.description}
              setValue={(val) => setFieldValue("description", val)}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default EventCreation;
