import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "@prisma/client";

import {
  CommonResponse,
  ScheduleInput,
} from "@interfaces/index";
import { isAuthenticated } from "@utils/auth";
import prisma from "@lib/prisma";
import { validateWeeklyHours } from "@utils/index";

const ApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<string>>,
) => {
  try {
    if (req.method?.toLowerCase() === "post") {
      const {
        authorization,
      } = req.headers;
      const {
        authenticated,
        payload: userInfo,
      } = isAuthenticated(authorization);
      const {
        id,
        name,
        dateOverrides,
        weeklyHours,
      } = req.body as ScheduleInput;
      if (authenticated && userInfo) {
        const isValid = validateWeeklyHours(weeklyHours);
        if (!isValid) {
          return res.status(400).json({
            status: "FAILED",
            data: "Validation Failed. Please check all dates.",
          });
        }
        const inputData = {
          name,
          dateOverrides: dateOverrides as unknown as Prisma.JsonArray,
          weeklyHours: weeklyHours as unknown as Prisma.JsonArray,
          userId: userInfo.id,
        };
        if (id) {
          const scheduleInfo = await prisma.schedule.findFirst({
            where: {
              id,
              userId: userInfo.id,
            }
          });
          if (scheduleInfo) {
            const data = await prisma.schedule.update({
              where: {
                id,
              },
              data: inputData,
            });
            return res.json({
              status: "SUCCESS",
              data: data.id,
            });
          }
          return res.status(400).json({
            status: "FAILED",
            data: "Invalid Schedule",
          });
        }
        const data = await prisma.schedule.create({
          data: inputData,
        });
        return res.json({
          status: "SUCCESS",
          data: data.id,
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
  } catch(err: any) {
    if (err.code === "P2002") {
      return res.status(500).json({
        status: "FAILED",
        data: "Name Already Taken",
      });
    }
    return res.status(500).json({
      status: "FAILED",
      data: "Server Error...",
    });
  }
}

export default ApiHandler;
