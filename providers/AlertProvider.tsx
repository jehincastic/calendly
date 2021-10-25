import React, { useState } from "react";

import { AlertProps, PartialAlertProps } from "@interfaces/index";
import Alerts from "@components/Alert";

interface ContextInterface extends AlertProps {
  setAlertInfo: (val: PartialAlertProps) => void;
}

export const AlertContext = React.createContext<ContextInterface>({
  horizontal: "left",
  msg: "",
  open: false,
  severity: "success",
  vertical: "bottom",
  setAlertInfo: () => {},
});

interface AlertProvierProps {};

const AlertProvider:  React.FC<AlertProvierProps> = ({ children }) => {
  const [alertInfo, setAlertInfo] = useState<AlertProps>({
    horizontal: "left",
    msg: "",
    open: false,
    severity: "success",
    vertical: "bottom",
  });

  const onclose = () => {
    setAlertInfo({
      horizontal: "left",
      msg: "",
      open: false,
      severity: "success",
      vertical: "bottom",
    })
  };

  return (
    <AlertContext.Provider
      value={{
        ...alertInfo,
        setAlertInfo: (val: PartialAlertProps) => {
          setAlertInfo({
            open: val?.open ?? true,
            horizontal: val?.horizontal || "right",
            vertical: val?.vertical || "bottom",
            severity: val?.severity || "success",
            msg: val.msg,
          });
        },
      }}
    >
      {
        alertInfo.open
          ? <Alerts {...alertInfo} onclose={onclose} />
          : ""
      }
      {children}
    </AlertContext.Provider>
  )
};

export default AlertProvider;
