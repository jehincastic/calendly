import type { NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@providers/AuthProvider";
import { AlertContext } from "@providers/AlertProvider";
import { LoadingContext } from "@providers/LoadingProvider";
import withNavBar from "@hocs/withNavBar";
import fetcher from "@utils/fetcher";
import NoRecords from "@components/NoRecords";
import {
  DateOverrides,
  ScheduleInput,
  SheduleDataDisplay,
  WeeklyHours,
} from "@interfaces/index";
import AddScheduleComp from "@components/AddScheduleComp";

const AddSchedule: NextPage = () => {
  const { user } = useAuth();
  const { setAlertInfo } = useContext(AlertContext);
  const { setLoading, isLoading } = useContext(LoadingContext);
  const [loading, setLoadingComp] = useState(false);
  const [scheduleData, setScheduleData] = useState<SheduleDataDisplay>();
  const router = useRouter();

  const fetchSchedule = async (scheduleId: string) => {
    const {
      status,
      data,
    } = await fetcher<any, SheduleDataDisplay>(
      `/api/get-schedule-info/${scheduleId}`,
      "GET",
    );
    if (status === "FAILED") {
      setAlertInfo({
        msg: data as string,
        severity: "error",
      });
      return undefined;
    }
    return data as SheduleDataDisplay;
  };
  
  const fetchInfo = async () => {
    const { id: scheduleId } = router.query;
    if (typeof scheduleId === "string") {
      const data = await fetchSchedule(scheduleId);
      setScheduleData(data);
      setLoadingComp(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user.loggedIn && !user.loading) {
      router.push("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  useEffect(() => {
    fetchInfo();
  }, [router]);

  useEffect(() => {
    setLoadingComp(true);
    setLoading(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (loading) {
        setLoading(true);
      }
    }
  }, [isLoading]);

  if (loading) {
    return <></>;
  }

  if (scheduleData) {
    return (
      <AddScheduleComp
        schedule={scheduleData}
        setScheduleData={setScheduleData}
      />
    );
  }
  return (
    <NoRecords
      btnName="My Schedules"
      btnClick={() => { router.push("/schedule") }}
      title="Invalid Schedule."
      subTitle={`Please Create A New Schedule.`}
    />
  )
};

export default withNavBar(AddSchedule);
