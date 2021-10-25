import React from "react";
import ButtonMui, { ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";


interface ButtonCompProps extends ButtonProps {
  loading?: boolean
}

const Button: React.FC<ButtonCompProps> = ({
  loading,
  children,
  ...remProps
}) => {
  if (loading) {
    return (
      <ButtonMui
        {...remProps}
        disabled
        startIcon={<CircularProgress color="inherit" size={12} />}
      >
        {children}
      </ButtonMui>
    )
  }
  return (
    <ButtonMui {...remProps}>
      {children}
    </ButtonMui>
  )
};

export default Button;
