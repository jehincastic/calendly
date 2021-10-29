import { format, add, startOfDay, parse } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

import { OptionType, ScheduleSlot, WeeklyHours } from "@interfaces/index";

export const isValidName = (name: string) => /^[A-Za-z0-9-.' ]*$/.test(name);

export const addTime = (minutes: number) => new Date(Date.now() + minutes * 60000);

export const getDefaultProfileImg = (username: string) => {
  return `https://avatars.dicebear.com/api/initials/${encodeURIComponent(username)}.svg`;
};

export const convertDuration = (val: number, type: string) => {
  if (type === "hour") {
    return (val * 60).toString();
  }
  return val.toString();
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
    timeMin: utcDate,
    timeMax: newDate,
  };
};

export const getSlots = () => {
  let returnData: OptionType[] = [];
  for (let i = 0; i < 12; i++) {
    const hour = i === 0 ? 12 : i;
    const elements: OptionType[] = [
      {
        value: `${hour}:00 AM`,
        label: `${hour}:00 AM`,
      }, {
        value: `${hour}:15 AM`,
        label: `${hour}:15 AM`,
      }, {
        value: `${hour}:30 AM`,
        label: `${hour}:30 AM`,
      }, {
        value: `${hour}:45 AM`,
        label: `${hour}:45 AM`,
      }
    ];
    returnData = [...returnData, ...elements]
  }
  for (let i = 0; i < 12; i++) {
    const hour = i === 0 ? 12 : i;
    const elements: OptionType[] = [
      {
        value: `${hour}:00 PM`,
        label: `${hour}:00 PM`,
      }, {
        value: `${hour}:15 PM`,
        label: `${hour}:15 PM`,
      }, {
        value: `${hour}:30 PM`,
        label: `${hour}:30 PM`,
      }, {
        value: `${hour}:45 PM`,
        label: `${hour}:45 PM`,
      }
    ];
    returnData = [...returnData, ...elements]
  }
  return returnData;
};

export const isTimeValid = (max: string, min: string, time: string) => {
  const [hour, minute] = time.split(":").map(e => Number(e));
  const [maxHour, maxMinute] = max.split(":").map(e => Number(e));
  const [minHour, minMinute] = min.split(":").map(e => Number(e));
  if (minute % 15 !== 0) {
    return false;
  }
  if (maxHour >= hour && hour >= minHour) {
    if (maxHour === hour) {
      if (maxMinute >= minute) {
        return true;
      }
      return false;
    }
    if (minHour === hour) {
      if (minute >= minMinute) {
        return true;
      }
      return false;
    }
    return true;
  }
  return false;
};

export const hourWithoutAm = (time: string) => format(parse(time, "HH:mm", new Date()), "hh:mm a");

export const hourWithAm = (time: string) => format(parse(time, "hh:mm a", new Date()), "HH:mm");

export const validateWeeklyHours = (data: WeeklyHours): boolean => {
  let isOneActive = false;
  let isValid = Object.values(data).every(d => {
    if (d.active) {
      if (d.schedule.length > 0) {
        isOneActive = true;
      }
      return isScheduleValid(d.schedule);
    }
    return true;
  });
  return isValid && isOneActive;
};

const isScheduleValid = (schedule: ScheduleSlot[]) => {
  let prevHour: number;
  let prevMin: number;
  let valid = true;
  schedule.find(s => {
    const isTheSlotValid = isSlotValid(s);
    if (prevHour !== undefined && prevMin !== undefined) {
      if (isTheSlotValid) {
        const [
          startSlotHour,
          startSlotMinute,
        ] = hourWithAm(s.start).split(":").map(e => Number(e));
        if (startSlotHour > prevHour) {
          return false;
        }
        if (startSlotHour === prevHour) {
          if (startSlotMinute >= prevMin) {
            return false;
          }
        }
      }
      valid = false;
      return true;
    }
    [prevHour, prevMin] = hourWithAm(s.end).split(":").map(e => Number(e));
    return !isTheSlotValid;
  });
  return valid;
};

const isSlotValid = (slot: ScheduleSlot) => {
  const {
    start,
    end,
  } = slot;
  const [startHour, startMinute] = hourWithAm(start).split(":").map(e => Number(e));
  const [endHour, endMinute] = hourWithAm(end).split(":").map(e => Number(e));
  if (startMinute % 15 !== 0 || endMinute % 15 !== 0) {
    return false;
  }
  if (startHour > endHour) {
    return false;
  }
  if (startHour === endHour) {
    if (startMinute >= endMinute) {
      return false;
    }
  }
  return true;
};