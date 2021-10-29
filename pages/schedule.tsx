import type { NextPage } from "next";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

import withNavBar from "@hocs/withNavBar";
import { AlertContext } from "@providers/AlertProvider";
import { LoadingContext } from "@providers/LoadingProvider";
import fetcher from "@utils/fetcher";
import { useAuth } from "@providers/AuthProvider";
import { ScheduleInput, SheduleDataAllDisplay } from "@interfaces/index";
import NoRecords from "@components/NoRecords";
import ScheduleAddDialog from "@components/ScheduleNameDialog";
import ScheduleList from "@components/ScheduleList";

const SchedulePage: NextPage = () => {
  const router = useRouter();
  const { setAlertInfo } = useContext(AlertContext);
  const { setLoading, isLoading } = useContext(LoadingContext);
  const [loading, setLoadingComp] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<SheduleDataAllDisplay[]>([]);

  const fetchInfo = async () => {
    const {
      data,
      status,
    } = await fetcher<any, SheduleDataAllDisplay[]>("/api/get-schedule", "get");
    if (status === "SUCCESS") {
      setSchedules(data as SheduleDataAllDisplay[]);
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

  const addSchedule = async (name: string) => {
    setLoading(true);
    const schedule: ScheduleInput = {
      name,
      dateOverrides: {},
      weeklyHours: {
        MON: {
          active: true,
          schedule: [{
            start: "09:00 AM",
            end: "05:00 PM"
          }],
        },
        TUE: {
          active: true,
          schedule: [{
            start: "09:00 AM",
            end: "05:00 PM"
          }],
        },
        WED: {
          active: true,
          schedule: [{
            start: "09:00 AM",
            end: "05:00 PM"
          }],
        },
        THU: {
          active: true,
          schedule: [{
            start: "09:00 AM",
            end: "05:00 PM"
          }],
        },
        FRI: {
          active: true,
          schedule: [{
            start: "09:00 AM",
            end: "05:00 PM"
          }],
        },
        SAT: {
          active: false,
          schedule: [],
        },
        SUN: {
          active: false,
          schedule: [],
        },
      },
    };
    const {
      data,
      status,
    } = await fetcher<ScheduleInput, string>(
      "/api/upsert-schedule",
      "POST",
      schedule,
    );
    if (status === "SUCCESS") {
      router.push(`/schedule/${data}`);
    } else {
      setAlertInfo({
        msg: data,
        severity: "error",
      });
      setLoading(false);
    }
  };

  if (isLoading) {
    return <></>;
  }

  if (schedules.length === 0) {
    return (
      <>
        <NoRecords
          btnName="Add New Schedule"
          btnClick={() => setOpen(true)}
          title="No Schedule found"
          subTitle={`Please Create a new Schedule.`}
        />
        <ScheduleAddDialog
          open={open}
          setOpen={setOpen}
          handleSubmit={addSchedule}
        />
      </>
    );
  }

  return (
    <>
      <ScheduleList
        schedules={schedules}
        handleClick={() => setOpen(true)}
      />
      <ScheduleAddDialog
        open={open}
        setOpen={setOpen}
        handleSubmit={addSchedule}
      />
    </>
  );
};

export default withNavBar(SchedulePage);
