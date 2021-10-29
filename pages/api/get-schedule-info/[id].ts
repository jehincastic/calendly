import type { NextApiRequest, NextApiResponse } from "next"

import {
  CommonResponse,
  DateOverrides,
  SheduleDataDisplay,
  WeeklyHours,
} from "@interfaces/index";
import { isAuthenticated } from "@utils/auth";
import prisma from "@lib/prisma";

const ApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<SheduleDataDisplay | string>>,
) => {
  try {
    if (req.method?.toLowerCase() === "get") {
      const {
        authorization,
      } = req.headers;
      const {
        authenticated,
        payload: userInfo,
      } = isAuthenticated(authorization);
      const {
        id,
      } = req.query as { id: string; };
      if (authenticated && userInfo) {
        const schedule = await prisma.schedule.findFirst({
          where: {
            userId: userInfo.id,
            id,
          },
        });
        if (schedule) {
          const returnData: SheduleDataDisplay = {
            name: schedule.name,
            id: schedule.id,
            weeklyHours: schedule.weeklyHours as unknown as WeeklyHours,
            dateOverrides: schedule.dateOverrides as unknown as DateOverrides,
          };
          return res.json({
            status: "SUCCESS",
            data: returnData,
          });
        }
        return res.status(403).json({
          status: "FAILED",
          data: "Invalid Input",
        });
      }
      return res.json({
        status: "FAILED",
        data: "Invalid Login",
      });
    }
    return res.status(405).json({
      status: "FAILED",
      data: "Invalid Method",
    });
  } catch(err) {
    return res.status(500).json({
      status: "FAILED",
      data: "Server Error...",
    });
  }
}

export default ApiHandler;
