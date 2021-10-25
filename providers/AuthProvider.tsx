import React, {
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";

import fetcher from "@utils/fetcher";
import { LoginResponse, JWTInfo } from "@interfaces/index";
import { LoadingContext } from "@providers/LoadingProvider";
import { AlertContext } from "@providers/AlertProvider";
import { getDefaultProfileImg } from "@utils/index";

interface AuthCtxType {
  user: JWTInfo & { loading: boolean; loggedIn: boolean };
  setUser: React.Dispatch<React.SetStateAction<JWTInfo & {
    loggedIn: boolean;
    loading: boolean;
  }>>;
}

const authContext = createContext<AuthCtxType>({
  user: {
    loggedIn: false,
    email: "",
    emailVerified: false,
    id: "",
    firstName: "",
    lastName: "",
    image: "",
    timezone: "",
    timezoneDiff: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    loading: true,
  },
  setUser: () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
};

const useProvideAuth = () => {
  const [user, setUser] = useState<JWTInfo & { loggedIn: boolean; loading: boolean }>({
    loggedIn: false,
    email: "",
    emailVerified: false,
    id: "",
    firstName: "",
    lastName: "",
    image: "",
    timezone: "",
    timezoneDiff: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    loading: true,
  });
  const { setLoading } = useContext(LoadingContext);
  const { setAlertInfo } = useContext(AlertContext);

  const fetchUserInfo = async () => {
    const response = await fetcher<any, LoginResponse>(
      "/api/me",
      "POST",
      {},
    );
    if (response.status === "SUCCESS") {
      const {
        user: fetchedUser,
      } = response.data as LoginResponse;
      if (!fetchedUser.image) {
        fetchedUser.image = getDefaultProfileImg(`${fetchedUser.firstName} ${fetchedUser.lastName}`);
      }
      setUser({
        ...fetchedUser,
        loggedIn: true,
        loading: false,
      });
    } else {
      if (response.data === "Network Called Failed") {
        setAlertInfo({
          msg: response.data,
          severity: "error",
        })
      } else {
        localStorage.removeItem(process.env.tokenKey || "");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(process.env.tokenKey || "");
    if (token) {
      setLoading(true);
      fetchUserInfo()
        .catch(() => {
          setUser({
            ...user,
            loading: false,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setUser({
        ...user,
        loading: false,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    user,
    setUser,
  };
};

export const useAuth = () => {
  return useContext(authContext);
};
