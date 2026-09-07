// pages/api/cron/create-weekly-period.ts

import type {
  NextApiRequest,
  NextApiResponse,
} from "next";

import { authorizeCron } from "@/server/email/cron-auth";
import {
  activatePeriod,
  getPreviousWeeklyPeriod,
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
    const dates = getPreviousWeeklyPeriod();

    const period = await activatePeriod({
      identifier: "LATEST_RELEASES",
      cadence: "WEEKLY",
      ...dates,
    });

    return response.status(200).json({
      success: true,
      period,
    });
  } catch (error) {
    console.error("Creating weekly period failed", error);

    return response.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}