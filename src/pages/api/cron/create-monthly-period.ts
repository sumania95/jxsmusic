// pages/api/cron/create-monthly-period.ts

import type {
  NextApiRequest,
  NextApiResponse,
} from "next";

import { authorizeCron } from "@/server/email/cron-auth";
import {
  activatePeriod,
  getPreviousMonthlyPeriod,
} from "@/server/email/period-utils";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "GET") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  if (!authorizeCron(request, response)) {
    return;
  }

  try {
    const dates = getPreviousMonthlyPeriod();

    const period = await activatePeriod({
      identifier: "TOP_DOWNLOADS",
      cadence: "MONTHLY",
      ...dates,
    });

    return response.status(200).json({
      success: true,
      period,
    });
  } catch (error) {
    console.error("Creating monthly period failed", error);

    return response.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}