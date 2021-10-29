import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "@prisma/client";
import argon2 from "argon2";

import {
  CommonResponse,
  EventFormSubmit,
} from "@interfaces/index";
import { isAuthenticated } from "@utils/auth";
import prisma from "@lib/prisma";
import { convertDuration, formatDate } from "@utils/index";

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
        link,
        description,
        type,
        isPrivate,
        password: rawPassword,
        isApprovalRequired,
        duration,
        durationVal,
        typeInfo,
        dateRange: [startDate, endDate],
        scheduleId,
        accountId,
        isActive,
      } = req.body as EventFormSubmit;
      if (authenticated && userInfo) {
        const password = await argon2.hash(rawPassword);
        const inputData = {
          name,
          link,
          description,
          type,
          isPrivate,
          password,
          isApprovalRequired,
          duration: convertDuration(duration, durationVal),
          typeInfo: typeInfo as Prisma.JsonArray,
          startDate: formatDate(new Date(startDate), "dd/MM/yyyy"),
          endDate: formatDate(new Date(endDate), "dd/MM/yyyy"),
          isActive: id ? true : !!isActive,
          accountId,
          userId: userInfo.id,
          scheduleId,
        };
        if (id) {
          const scheduleInfo = await prisma.event.findFirst({
            where: {
              id,
              userId: userInfo.id,
              accountId,
            }
          });
          if (scheduleInfo) {
            const data = await prisma.event.update({
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
        const data = await prisma.event.create({
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
  } catch (err: any) {
    console.error(err);
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
