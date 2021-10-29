import { EventType } from "@prisma/client";
import {
  AlertColor,
} from "@mui/material";
import { calendar_v3 } from "googleapis";

export interface CommonResponse<T> {
  status: "SUCCESS" | "FAILED";
  data: T;
}

export interface JWTInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  timezone: string;
  timezoneDiff: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserJWT extends JWTInfo {
  iat: number;
}

interface CommonInputForm {
  email: string;
  password: string;
}

export interface LoginInput extends CommonInputForm {
  rememberMe: boolean;
}

export interface SignUpInput extends CommonInputForm {
  firstName: string;
  lastName: string;
  country: string;
  timezone: string;
  timezoneDiff: string;
}

export interface OptionType {
  value: string;
  label: string;
}

export interface LoginResponse {
  token: string;
  user: JWTInfo,
}

export type AuthResp = {
  authenticated: boolean;
  payload?: UserJWT;
}

export enum MailType {
  SIGNUP="SIGNUP"
}

export interface AlertProps {
  open: boolean;
  horizontal: "left" | "center" | "right";
  vertical: "top" | "bottom";
  severity: AlertColor;
  msg: string;
}

export interface PartialAlertProps {
  open?: boolean;
  horizontal?: "left" | "center" | "right";
  vertical?: "top" | "bottom";
  severity?: AlertColor;
  msg: string;
}

export interface AccountDisplay {
  name: string;
  email: string;
  id: string;
  providerType: string;
}

export enum WeekDays {
  SUN="SUN",
  MON="MON",
  TUE="TUE",
  WED="WED",
  THU="THU",
  FRI="FRI",
  SAT="SAT",
};

export interface ScheduleSlot {
  start: string;
  end: string;
}

export interface ScheduleInfo {
  active: boolean;
  schedule: ScheduleSlot[];
}

export type WeeklyHours = {
  [key in WeekDays]: ScheduleInfo;
}

export type DateOverrides = {
  [key: string]: ScheduleInfo;
}

export interface SheduleDataDisplay {
  id: string;
  name: string;
  weeklyHours: WeeklyHours;
  dateOverrides: DateOverrides;
}

export interface SheduleDataAllDisplay {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventsDisplayAll {
  id: string;
  name: string;
  link: string;
  type: EventType;
  isPrivate: boolean;
  isApprovalRequired: boolean;
  duration: string;
  endDate: string;
  isActive: boolean;
  scheduleName: string;
}

export interface EventFormSubmit {
  id?: string;
  name: string;
  link: string;
  description: string;
  type: EventType;
  isPrivate: boolean;
  password: string;
  isApprovalRequired: boolean;
  duration: number;
  durationVal: string;
  typeInfo: {};
  dateRange: Date[];
  scheduleId: string;
  accountId: string;
  isActive?: boolean;
}

export interface ScheduleInput {
  id?: string;
  name: string;
  weeklyHours: WeeklyHours;
  dateOverrides: DateOverrides;
}

export interface CalendarInfoInput {
  timeMin: string;
  timeMax: string;
  accountId: string;
}

type OptionalString = string | null | undefined;

type OrganizerType = {
  displayName?: string | undefined;
  email?: string | undefined;
  id?: string | undefined;
  self?: boolean | undefined;
} | null | undefined;

export interface CalendarInfo {
  id: OptionalString;
  location: OptionalString;
  organizer: OrganizerType;
  start: calendar_v3.Schema$EventDateTime | undefined;
  end: calendar_v3.Schema$EventDateTime | undefined;
  status: OptionalString;
  title: string;
  description: OptionalString;
  htmlLink: OptionalString;
  attachments: calendar_v3.Schema$EventAttachment[] | undefined;
  attendees: calendar_v3.Schema$EventAttendee[] | undefined;
  conferenceData: calendar_v3.Schema$ConferenceData | undefined;
  hangoutLink: OptionalString;
  startDate: string;
  endDate: string;
};

export interface CountryOption {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

export interface TimezoneOption {
  zoneName: string;
  countryName: string;
  countryCode: string;
  gmtOffset: number;
  timestamp: number;
}

export interface ScheduleCompProps {
  schedule: SheduleDataDisplay;
  setScheduleData: (newSchedule: SheduleDataDisplay) => void;
}