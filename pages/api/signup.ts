import type { NextApiRequest, NextApiResponse } from "next"
import argon2 from "argon2";

import {
  CommonResponse,
  JWTInfo,
  MailType,
  SignUpInput,
} from "@interfaces/index";
import { hashToken } from "@utils/auth";
import prisma from "@lib/prisma";
import { addTime } from "@utils/index";
import { sendMail } from "@utils/sendMail";

const ApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<string>>,
) => {
  if (req.method?.toLowerCase() === "post") {
    try {
      const {
        email,
        firstName,
        lastName,
        country,
        timezone,
        password: rawPassword,
        timezoneDiff,
      } = req.body as SignUpInput;
      const password = await argon2.hash(rawPassword);
      const hashedToken = hashToken(JSON.stringify({
        email,
        firstName,
        lastName,
        date: Date.now(),
      }));
      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password,
          country,
          timezone,
          timezoneDiff,
          verificationRequest: {
            create: {
              token: hashedToken,
              expires: addTime(90),
            },
          },
        },
      });
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
      sendMail<string>(userInfo, hashedToken, MailType.SIGNUP);
      return res.status(200).json({
        status: "SUCCESS",
        data: "Email has been sent to your registered mail id.",
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