import type { NextApiRequest, NextApiResponse } from "next"

import { AccountDisplay, CommonResponse } from "@interfaces/index";
import { isAuthenticated } from "@utils/auth";
import prisma from "@lib/prisma";

const ApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<AccountDisplay[] | string>>,
) => {
  if (req.method?.toLowerCase() === "get") {
    const {
      authorization,
    } = req.headers;
    const {
      authenticated,
      payload: userInfo,
    } = isAuthenticated(authorization);
    if (authenticated && userInfo) {
      const accouts = await prisma.account.findMany({
        where: {
          userId: userInfo.id,
        },
      });
      const returnData: AccountDisplay[] = accouts.map(acc => ({
        name: acc.name,
        email: acc.email,
        id: acc.id,
        providerType: acc.providerType,
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
}

export default ApiHandler;
