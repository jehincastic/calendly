import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Card from "@mui/material/Card";

import Weeklyhours from "@components/Weeklyhours";
import { ScheduleCompProps } from "@interfaces/index";

interface AddScheduleTabProps extends ScheduleCompProps {}

const AddScheduleTab: React.FC<AddScheduleTabProps> = ({
  schedule,
  setScheduleData,
}) => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Card raised>
      <TabContext value={value}>
        <Box sx={{
          borderBottom: 1,
          borderColor: "divider"
          }}
        >
          <TabList onChange={handleChange} aria-label="Add Schedule">
            <Tab label="Weekly Hours" value="1" />
            <Tab label="Date Overrides" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Weeklyhours
            schedule={schedule}
            setScheduleData={setScheduleData}
          />
        </TabPanel>
        <TabPanel value="2">
          WIP...
        </TabPanel>
      </TabContext>
    </Card>
  );
};

export default AddScheduleTab;
