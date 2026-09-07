// server/email/cron-auth.ts

import type {
  NextApiRequest,
  NextApiResponse,
} from "next";

export function authorizeCron(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (
    !process.env.NEXT_CRON_SECRET ||
    request.headers.authorization !==
      `Bearer ${process.env.NEXT_CRON_SECRET}`
  ) {
    response.status(401).json({
      error: "Unauthorized",
    });

    return false;
  }

  return true;
}