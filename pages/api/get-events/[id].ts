import type { NextApiRequest, NextApiResponse } from "next"

import {
  CommonResponse,
  EventsDisplayAll,
} from "@interfaces/index";
import { isAuthenticated } from "@utils/auth";
import prisma from "@lib/prisma";

const ApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<{data: EventsDisplayAll[], email: string} | string>>,
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
        const accountProm = prisma.account.findFirst({
          where: {
            id,
          }
        });
        const eventsProm = prisma.event.findMany({
          where: {
            userId: userInfo.id,
            accountId: id,
          },
          select: {
            id: true,
            name: true,
            link: true,
            type: true,
            isPrivate: true,
            isApprovalRequired: true,
            duration: true,
            endDate: true,
            isActive: true,
            schedule: {
              select: {
                name: true,
              }
            }
          }
        });
        const [account, events] = await Promise.all([accountProm, eventsProm]);
        if (!account) {
          return res.json({
            status: "FAILED",
            data: "Invalid Input",
          });      
        }
        const returnData: EventsDisplayAll[] = events.map(event => ({
          id: event.id,
          name: event.name,
          link: event.link,
          type: event.type,
          isPrivate: event.isPrivate,
          isApprovalRequired: event.isApprovalRequired,
          duration: event.duration,
          endDate: event.endDate,
          isActive: event.isActive,
          scheduleName: event.schedule.name,
        }));
        return res.json({
          status: "SUCCESS",
          data: {
            data: returnData,
            email: account.username,
          },
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
