import React, { useState } from "react";

import Backdrop from "@components/Backdrop";

interface ContextInterface {
  isLoading: boolean;
  setLoading: (val: boolean) => void;
}

export const LoadingContext = React.createContext<ContextInterface>({
  isLoading: false,
  setLoading: () => {},
});

interface LoadingProvierProps {};

const LoadingProvider:  React.FC<LoadingProvierProps> = ({ children }) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
      }}
    >
      {
        isLoading
          ? (
            <Backdrop open={isLoading} />
          )
          : null
      }
      {children}
    </LoadingContext.Provider>
  )
};

export default LoadingProvider;
