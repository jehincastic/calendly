import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { AlertProps } from "@interfaces/index";

interface AlertInterface extends AlertProps {
  onclose: () => void;
}

const Alerts: React.FC<AlertInterface> = ({
  severity,
  open: isOpen,
  onclose,
  horizontal,
  vertical,
  msg,
}) => {
  const [
    open,
    setOpen
  ] = React.useState(isOpen);

  const handleClose = () => {
    onclose();
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{
        vertical,
        horizontal,
      }}
    >
      <MuiAlert
        variant="filled"
        onClose={handleClose}
        severity={severity}
      >
        {msg}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alerts;
