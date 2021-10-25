import type { NextApiRequest, NextApiResponse } from "next"

import { LoginResponse, CommonResponse } from "@interfaces/index";
import { splitToken, verifyJwt } from "@utils/auth";

const ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<LoginResponse | string>>,
) => {
  if (req.method?.toLowerCase() === "post") {
    const {
      authorization,
    } = req.headers;
    const token = splitToken(authorization);
    if (token) {
      try {
        const userInfo = verifyJwt(token);
        return res.json({
          status: "SUCCESS",
          data: {
            user: userInfo,
            token,
          },
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
