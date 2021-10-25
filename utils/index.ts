import { format, add, startOfDay } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export const isValidName = (name: string) => /^[A-Za-z0-9-.' ]*$/.test(name);

export const addTime = (minutes: number) => new Date(Date.now() + minutes * 60000);

export const getDefaultProfileImg = (username: string) => {
  return `https://avatars.dicebear.com/api/initials/${encodeURIComponent(username)}.svg`;
};

export const formatDate = (
  date = new Date(),
  formatVal = "yyyy-MM-dd"
) => format(date, formatVal);

export const capitalizeFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export const getTimeDiff = (gmtdiff: number) => {
  const time = Math.abs(gmtdiff);
  const isPositive = time >= 0 ? true : false;
  const timeDiffInMins = time / 60;
  const mins = timeDiffInMins % 60;
  const displayMins = mins < 10 ? `0${mins}` : mins;
  const hours = (timeDiffInMins - (timeDiffInMins % 60)) / 60;
  const displayHours = hours < 10 ? `0${hours}` : hours;
  return `${isPositive ? "+" : "-"}${displayHours}:${displayMins}`;
}

export const getStartAndEndTime = (
  timezone: string,
  startDate = new Date(),
  days = 4,
) => {
  const date = startDate.toISOString();
  const utcDate = startOfDay(utcToZonedTime(date, timezone));
  const newDate = add(utcDate, {
    days,
  });
  return {
    timeMin: utcDate.toISOString(),
    timeMax: newDate.toISOString(),
  };
};