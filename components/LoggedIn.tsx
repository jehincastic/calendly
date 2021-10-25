import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import AccountsList from "@components/AccountsList";
import NoRecords from "@components/NoRecords";
import fetcher from "@utils/fetcher";
import { AlertContext } from "@providers/AlertProvider";
import { LoadingContext } from "@providers/LoadingProvider";
import { AccountDisplay } from "@interfaces/index";

const LoggedIn: React.FC = () => {
  const { setAlertInfo } = useContext(AlertContext);
  const { setLoading, isLoading } = useContext(LoadingContext);
  const [loading, setLoadingComp] = useState(false);
  const [accounts, setAccounts] = useState<AccountDisplay[]>([]);

  const handleOAuthLogin = async (provider: string) => {
    setLoading(true);
    const {
      data,
      status,
    } = await fetcher<any, string>(`/api/${provider}-auth`, "post");
    if (status === "FAILED") {
      setAlertInfo({
        msg: data,
        severity: "error",
      });
      setLoading(false);
    } else {
      window.location.href = data;
    }
  };

  const fetchAccounts = async () => {
    const {
      data,
      status,
    } = await fetcher<any, AccountDisplay[]>("/api/get-accounts", "get");
    setLoadingComp(false);
    if (status === "FAILED") {
      setAlertInfo({
        msg: data as string,
        severity: "error",
      });
      setLoading(false);
    } else {
      const userAccounts = data as AccountDisplay[];
      setAccounts(userAccounts);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setLoadingComp(true)
    setLoading(true);
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (loading) {
        setLoading(true);
      }
    }
  }, [isLoading])

  if (isLoading) {
    return <></>;
  }

  if (accounts.length > 0) {
    return (
      <AccountsList
        accounts={accounts}
        handleOAuthLogin={handleOAuthLogin}
      />
    );
  } else {
    return (
      <NoRecords
        btnName="Link Your Google Account."
        btnClick={() => handleOAuthLogin("google")}
        title="No Accounts Linked"
        subTitle={`Please link a account to use ${process.env.appName}.`}
      />
    );
  }
};

export default LoggedIn;
