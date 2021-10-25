import type { NextApiRequest, NextApiResponse } from "next";

import {
  LoginResponse,
  CommonResponse,
  JWTInfo,
  MailType,
} from "@interfaces/index";
import { hashToken, signJwt } from "@utils/auth";
import prisma from "@lib/prisma";
import { addTime } from "@utils/index";
import { sendMail } from "@utils/sendMail";

const ApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<LoginResponse | string>>,
) => {
  if (req.method?.toLowerCase() === "post") {
    try {
      const {
        id,
      } = req.query as { id: string; };
      const dbVal = await prisma.verificationRequest.findFirst({
        where: {
          token: id,
        },
        include: {
          user: true,
        },
      });
      if (dbVal) {
        const { user } = dbVal;
        const userInfo: JWTInfo = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
          image: user.image,
          timezone: user.timezone,
          timezoneDiff: user.timezoneDiff,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
        if (dbVal.expires.getTime() > Date.now()) {
          await prisma.$transaction([
            prisma.verificationRequest.delete({
              where: {
                token: id,
              },
            }),
            prisma.user.update({
              data: {
                emailVerified: true,
              },
              where: {
                id: user.id,
              },
            }),
          ]);
          const token = await signJwt(userInfo);
          return res.status(200).json({
            status: "SUCCESS",
            data: {
              user: userInfo,
              token,
            },
          });
        }
        const hashedToken = hashToken(JSON.stringify({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          date: Date.now(),
        }));
        await prisma.$transaction([
          prisma.verificationRequest.delete({
            where: {
              token: id,
            },
          }),
          prisma.verificationRequest.create({
            data: {
              token: hashedToken,
              expires: addTime(90),
              userId: user.id,
            },
          }),
        ]);
        sendMail<string>(userInfo, hashedToken, MailType.SIGNUP);
        return res.status(403).json({
          status: "FAILED",
          data: "Token Expired. A Mail has been resend.",
        });
      }
      return res.status(403).json({
        status: "FAILED",
        data: "Invalid Token",
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return res.status(500).json({
        status: "FAILED",
        data: "Server Error...",
      });
    }
  }
  return res.status(405).json({
    status: "FAILED",
    data: "Invalid Method",
  });
}

export default ApiHandler;
