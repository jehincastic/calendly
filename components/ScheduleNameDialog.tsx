import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Button from "@components/Button";

interface ScheduleAddDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  handleSubmit: (name: string) => Promise<void>;
}

const ScheduleAddDialog: React.FC<ScheduleAddDialogProps> = ({
  open,
  setOpen,
  handleSubmit,
}) => {
  const [scheduleName, setScheduleName] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New schedule</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Give a name for your schedule. Try picking an unique name.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Schedule Name"
          type="text"
          fullWidth
          variant="standard"
          value={scheduleName}
          onChange={e => {
            setScheduleName(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setScheduleName("");
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={!!!scheduleName}
          onClick={() => handleSubmit(scheduleName)}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleAddDialog;
