import type { NextApiRequest, NextApiResponse } from "next";

import { CommonResponse } from "@interfaces/index";
import { getToken } from "@utils/google";
import prisma from "@lib/prisma";
import { isAuthenticated } from "@utils/auth";

const ApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<string>>,
) => {
  if (req.method?.toLowerCase() === "post") {
    const {
      code,
    } = req.body as { code?: string; };
    const {
      authorization,
    } = req.headers;
    const {
      authenticated,
      payload: userInfo,
    } = isAuthenticated(authorization);
    if (code && typeof code === "string" && authenticated && userInfo) {
      try {
        const { token, payload } = await getToken(code);
        await prisma.account.create({
          data: {
            userId: userInfo.id,
            providerType: "GOOGLE",
            providerAccountId: payload.sub,
            refreshToken: token.refresh_token,
            accessToken: token.access_token,
            email: payload.email || "",
            username: payload.email?.split("@")[0] || "",
            name: payload.name || "",
          }
        });
        return res.json({
          status: "SUCCESS",
          data: "Account Linked Successfully",
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        return res.json({
          status: "FAILED",
          data: "Invalid Token",
        });
      }
    }
    return res.json({
      status: "FAILED",
      data: "Invalid Callback",
    });
  }
  return res.status(405).json({
    status: "FAILED",
    data: "Invalid Method",
  });
}

export default ApiHandler;
