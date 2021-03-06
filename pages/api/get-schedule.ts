import type { NextApiRequest, NextApiResponse } from "next"

import {
  SheduleDataAllDisplay,
  CommonResponse,
} from "@interfaces/index";
import { isAuthenticated } from "@utils/auth";
import prisma from "@lib/prisma";

const ApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<SheduleDataAllDisplay[] | string>>,
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
      if (authenticated && userInfo) {
        const schedules = await prisma.schedule.findMany({
          where: {
            userId: userInfo.id,
          },
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          }
        });
        const returnData: SheduleDataAllDisplay[] = schedules.map(sch => ({
          name: sch.name,
          id: sch.id,
          createdAt: sch.createdAt,
          updatedAt: sch.updatedAt,
        }))
        return res.json({
          status: "SUCCESS",
          data: returnData,
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
