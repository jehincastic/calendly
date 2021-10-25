import type { NextApiRequest, NextApiResponse } from "next"

import { CommonResponse } from "@interfaces/index";
import { splitToken, verifyJwt } from "@utils/auth";
import { getLoginUrl } from "@utils/google";

const ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<string>>,
) => {
  if (req.method?.toLowerCase() === "post") {
    const {
      authorization,
    } = req.headers;
    const token = splitToken(authorization);
    if (token) {
      try {
        verifyJwt(token);
        const url = getLoginUrl();
        return res.json({
          status: "SUCCESS",
          data: url,
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
      data: "Invalid Token",
    });
  }
  return res.status(405).json({
    status: "FAILED",
    data: "Invalid Method",
  });
}

export default ApiHandler;
