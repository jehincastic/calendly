import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { LoadingContext } from "@providers/LoadingProvider";
import { AlertContext } from "@providers/AlertProvider";
import fetcher from "@utils/fetcher";
import { LoginResponse } from "@interfaces/index";
import { useAuth } from "@providers/AuthProvider";
import withNavBar from "@hocs/withNavBar";
import { getDefaultProfileImg } from "@utils/index";

interface VerifyProps {};

const VerifyPage: React.FC<VerifyProps> = () => {
  const { setUser, user } = useAuth();
  const router = useRouter();
  const { setLoading } = useContext(LoadingContext);
  const { setAlertInfo } = useContext(AlertContext);

  useEffect(() => {
    if (user.loggedIn) {
      router.push("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    fetchToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    setLoading(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const fetchToken = async () => {
    const { id: token } = router.query;
    if (typeof token === "string") {
      const data = await fetcher<{ name: string; }, LoginResponse | string>(
        `/api/verify/${token}`,
        "POST",
      );
      if (data.status === "SUCCESS") {
        const info = data.data as LoginResponse;
        localStorage.setItem(process.env.tokenKey || "", info.token);
        if (!info.user.image) {
          info.user.image = getDefaultProfileImg(`${info.user.firstName} ${info.user.lastName}`);
        }
        setUser({
          ...info.user,
          loggedIn: true,
          loading: false,
        });
        setAlertInfo({
          msg: `Welcome ${info.user.firstName}`,
        });
        setLoading(false);
      } else {
        setAlertInfo({
          msg: data.data as string,
          severity: "error",
        });
        setLoading(false);
      }
    }
  };

  return (
    <>
    </>
  );
  
};

export default withNavBar(VerifyPage);
