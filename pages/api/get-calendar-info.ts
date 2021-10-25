import type { NextApiRequest, NextApiResponse } from "next"

import {
  CalendarInfoInput,
  CommonResponse,
  CalendarInfo,
} from "@interfaces/index";
import { isAuthenticated } from "@utils/auth";
import prisma from "@lib/prisma";
import { getCalendarList } from "@utils/google";

const ApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<CalendarInfo[] | string>>,
) => {
  try {
    if (req.method?.toLowerCase() === "post") {
      const {
        authorization,
      } = req.headers;
      const {
        timeMin,
        timeMax,
        accountId,
      } = req.body as CalendarInfoInput;
      const {
        authenticated,
        payload: userInfo,
      } = isAuthenticated(authorization);
      if (authenticated && userInfo) {
        const account = await prisma.account.findFirst({
          where: {
            id: accountId,
            userId: userInfo.id,
          }
        });
        if (account) {
          const calendarData = await getCalendarList(
            account.accessToken,
            account.refreshToken,
            account.email,
            timeMin,
            timeMax,
            userInfo.timezone,
          );
          let returnData: CalendarInfo[] = [];
          if (calendarData) {
            returnData = calendarData.map(({
              id,
              location,
              organizer,
              description,
              start,
              status,
              summary,
              htmlLink,
              end,
              attachments,
              attendees,
              conferenceData,
              hangoutLink,
            }) => ({
              id,
              location,
              description,
              organizer,
              start,
              status,
              title: summary || "",
              htmlLink,
              end,
              attachments,
              attendees,
              conferenceData,
              hangoutLink,
              startDate: start?.dateTime || "",
              endDate: end?.dateTime || "",
            }))
          }
          return res.json({
            status: "SUCCESS",
            data: returnData,
          });
        }
        return res.json({
          status: "FAILED",
          data: "Invalid Input",
        });
      }
      return res.status(403).json({
        status: "FAILED",
        data: "Invalid Login",
      });
    }
    return res.status(405).json({
      status: "FAILED",
      data: "Invalid Method",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "FAILED",
      data: "Something Went Wrong",
    });
  }
}

export default ApiHandler;
