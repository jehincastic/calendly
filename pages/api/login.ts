import type { NextApiRequest, NextApiResponse } from "next"
import argon2 from "argon2";

import {
  LoginResponse,
  CommonResponse,
  LoginInput,
  JWTInfo,
} from "@interfaces/index";
import { signJwt } from "@utils/auth";
import prisma from "@lib/prisma";

const ApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<LoginResponse | string>>,
) => {
  if (req.method?.toLowerCase() === "post") {
    try {
      const {
        email,
        password,
      } = req.body as LoginInput;
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (user) {
        const passwordVerified = await argon2.verify(user.password, password);
        if (!user.emailVerified) {
          return res.status(403).json({
            status: "FAILED",
            data: "Please verify your email address.",
          });
        }
        if (passwordVerified) {
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
          const token = await signJwt(userInfo);
          return res.status(200).json({
            status: "SUCCESS",
            data: {
              user: userInfo,
              token,
            },
          });
        }
      }
      return res.status(403).json({
        status: "FAILED",
        data: "Invalid Email / Password",
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
