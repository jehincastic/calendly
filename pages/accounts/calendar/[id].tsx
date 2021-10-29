import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { LoadingContext } from "@providers/LoadingProvider";
import { AlertContext } from "@providers/AlertProvider";
import fetcher from "@utils/fetcher";
import { CalendarInfo, CalendarInfoInput } from "@interfaces/index";
import { useAuth } from "@providers/AuthProvider";
import withNavBar from "@hocs/withNavBar";
import { getStartAndEndTime } from "@utils/index";
import AccountCalendar from "@components/AccountCalendar";

interface EventListProps {};

const EventsListPage: React.FC<EventListProps> = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { setLoading, isLoading } = useContext(LoadingContext);
  const { setAlertInfo } = useContext(AlertContext);
  const [calInfo, setCalInfo] = useState<CalendarInfo[]>([]);
  const [loading, setLoadingComp] = useState(false);

  const viewCalendar = async (accountId: string) => {
    const {
      timeMin,
      timeMax,
    } = getStartAndEndTime(user.timezone);
    const input: CalendarInfoInput = {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      accountId,
    };
    const {
      status,
      data,
    } = await fetcher<CalendarInfoInput, CalendarInfo[]>(
      "/api/get-calendar-info",
      "POST",
      input,
    );
    if (status === "FAILED") {
      setAlertInfo({
        msg: data as string,
        severity: "error",
      });
      return [];
    }
    return data as CalendarInfo[];
  };

  useEffect(() => {
    if (!user.loggedIn && !user.loading) {
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
    const { id: accountId } = router.query;
    if (typeof accountId === "string") {
      const data = await viewCalendar(accountId);
      setCalInfo(data);
      setLoadingComp(false);
      setLoading(false);
    }
  };

  return (
    <AccountCalendar />
  );
  
};

export default withNavBar(EventsListPage);
