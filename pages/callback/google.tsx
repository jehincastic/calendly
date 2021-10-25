import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { LoadingContext } from "@providers/LoadingProvider";
import { AlertContext } from "@providers/AlertProvider";
import fetcher from "@utils/fetcher";
import { useAuth } from "@providers/AuthProvider";
import withNavBar from "@hocs/withNavBar";

interface VerifyProps {};

const VerifyPage: React.FC<VerifyProps> = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { setLoading, isLoading } = useContext(LoadingContext);
  const { setAlertInfo } = useContext(AlertContext);
  const [loading, setLoadingComp] = useState(false);

  useEffect(() => {
    if (!user.loading && !user.loggedIn) {
      router.push("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    fetchToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (!isLoading) {
      if (loading) {
        setLoading(true);
      }
    }
  }, [isLoading])

  useEffect(() => {
    setLoadingComp(true);
    setLoading(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const fetchToken = async () => {
    const { code: token } = router.query;
    if (typeof token === "string") {
      const data = await fetcher<{ code: string; }, string>(
        "/api/callback/google",
        "POST",
        {
          code: token,
        }
      );
      if (data.status === "FAILED") {
        setAlertInfo({
          msg: data.data as string,
          severity: "error",
        });
      }
      router.push("/");
    }
  };

  return (
    <>
    </>
  );
  
};

export default withNavBar(VerifyPage);
