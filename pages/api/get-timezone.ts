import type { NextApiRequest, NextApiResponse } from "next";
import Axios from "axios";

import { CommonResponse, TimezoneOption } from "@interfaces/index";

const ApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<TimezoneOption[] | string>>,
) => {
  if (req.method?.toLowerCase() === "post") {
    const {
      country: countryCode,
    } = req.query as { country: string; };
    const { data } = await Axios.get<{
      status: string,
      message: string,
      zones: TimezoneOption[]
    }>(`${process.env.NEXT_APP_TIMEZONE_URI}${countryCode}`);
    if (data.status.toUpperCase() === "OK") {
      return res.json({
        status: "SUCCESS",
        data: data.zones,
      });
    }
    return res.status(500).json({
      status: "FAILED",
      data: "Internal Server Error...",
    });
  }
  return res.status(405).json({
    status: "FAILED",
    data: "Invalid Method",
  });
}

export default ApiHandler;
