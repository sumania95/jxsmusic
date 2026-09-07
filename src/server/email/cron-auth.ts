// server/email/cron-auth.ts

import type {
  NextApiRequest,
  NextApiResponse,
} from "next";

export function authorizeCron(
  request: NextApiRequest,
  response: NextApiResponse,
): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const authorization =
    request.headers.authorization;

  if (
    !cronSecret ||
    authorization !== `Bearer ${cronSecret}`
  ) {
    response.status(401).json({
      error: "Unauthorized",
    });

    return false;
  }

  return true;
}