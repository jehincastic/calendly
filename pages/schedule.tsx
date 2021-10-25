import type { NextPage } from "next";
import { useContext, useState, useEffect } from "react";
import Container from "@mui/material/Container";
import { useRouter } from "next/router";

import withNavBar from "@hocs/withNavBar";
import { AlertContext } from "@providers/AlertProvider";
import { LoadingContext } from "@providers/LoadingProvider";
import fetcher from "@utils/fetcher";
import { useAuth } from "@providers/AuthProvider";
import { SheduleDataDisplay } from "@interfaces/index";
import NoRecords from "@components/NoRecords";

const SchedulePage: NextPage = () => {
  const router = useRouter();
  const { setAlertInfo } = useContext(AlertContext);
  const { setLoading, isLoading } = useContext(LoadingContext);
  const [loading, setLoadingComp] = useState(false);
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<SheduleDataDisplay[]>([]);

  const fetchInfo = async () => {
    const {
      data,
      status,
    } = await fetcher<any, SheduleDataDisplay[]>("/api/get-schedule", "get");
    if (status === "SUCCESS") {
      setSchedules(data as SheduleDataDisplay[]);
    } else {
      setAlertInfo({
        msg: data as string,
        severity: "error",
      });
    }
    setLoadingComp(false);
    setLoading(false);
  };

  useEffect(() => {
    if (!user.loggedIn && !user.loading) {
      router.push("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  useEffect(() => {
    setLoadingComp(true)
    setLoading(true);
    fetchInfo();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (loading) {
        setLoading(true);
      }
    }
  }, [isLoading]);

  const addSchedule = () => {
    router.push("/schedule/add");
  };

  if (isLoading) {
    return <></>;
  }

  if (schedules.length === 0) {
    return (
      <NoRecords
        btnName="Add New Schedule"
        btnClick={addSchedule}
        title="No Schedule found"
        subTitle={`Please Create a new Schedule.`}
      />
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <h1>Hello...</h1>
    </Container>
  );
};

export default withNavBar(SchedulePage);
