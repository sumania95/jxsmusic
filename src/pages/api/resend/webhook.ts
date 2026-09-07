import type {
  NextApiRequest,
  NextApiResponse,
} from "next";
import { Resend } from "resend";

import { db } from "@/server/db";

const resend = new Resend(process.env.RESEND_API_KEY);

/*
 * Resend signature verification requires the exact raw body.
 * Next.js must not parse the JSON first.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

type ResendWebhookEvent = {
  type:
    | "email.sent"
    | "email.delivered"
    | "email.delivery_delayed"
    | "email.failed"
    | "email.bounced"
    | "email.complained"
    | "email.suppressed"
    | "email.opened"
    | "email.clicked";
  created_at: string;
  data: {
    email_id: string;
    to?: string[];
    subject?: string;
    bounce?: {
      message?: string;
      type?: string;
      subType?: string;
    };
  };
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");

    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  const webhookSecret =
    process.env.NEXT_RESEND_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("NEXT_RESEND_WEBHOOK_SECRET is missing");

    return response.status(500).json({
      error: "Webhook secret is missing",
    });
  }

  try {
    const payload = await readRawBody(request);

    const svixId = getHeader(request, "svix-id");
    const svixTimestamp = getHeader(
      request,
      "svix-timestamp",
    );
    const svixSignature = getHeader(
      request,
      "svix-signature",
    );

    if (
      !svixId ||
      !svixTimestamp ||
      !svixSignature
    ) {
      return response.status(400).json({
        error: "Missing webhook signature headers",
      });
    }

    /*
     * Verification throws if the signature is invalid.
     */
    const event = resend.webhooks.verify({
      payload,
      headers: {
        id: svixId,
        timestamp: svixTimestamp,
        signature: svixSignature,
      },
      webhookSecret,
    }) as ResendWebhookEvent;

    const resendId = event.data.email_id;
    const eventDate = new Date(event.created_at);

    switch (event.type) {
      case "email.sent": {
        /*
         * Resend accepted the email and will attempt delivery.
         */
        await db.periodUser.updateMany({
          where: {
            resendId,
            sentAt: null,
          },
          data: {
            sentAt: eventDate,
          },
        });

        break;
      }

      case "email.delivered": {
        /*
         * The recipient's email server accepted the message.
         */
        await db.periodUser.updateMany({
          where: {
            resendId,
            deliveredAt: null,
          },
          data: {
            deliveredAt: eventDate,
          },
        });

        break;
      }

      case "email.delivery_delayed": {
        console.warn("Resend delivery delayed", {
          resendId,
          recipients: event.data.to,
        });

        break;
      }

      case "email.failed": {
        console.error("Resend email failed", {
          resendId,
          recipients: event.data.to,
        });

        break;
      }

      case "email.bounced": {
        console.error("Resend email bounced", {
          resendId,
          recipients: event.data.to,
          bounce: event.data.bounce,
        });

        break;
      }

      case "email.complained": {
        console.error("Recipient reported spam", {
          resendId,
          recipients: event.data.to,
        });

        /*
         * Consider disabling weekly emails for this user.
         */

        break;
      }

      case "email.suppressed": {
        console.error("Resend email suppressed", {
          resendId,
          recipients: event.data.to,
        });

        break;
      }

      case "email.opened":
      case "email.clicked": {
        // Ignore these unless you need engagement analytics.
        break;
      }
    }

    /*
     * Return 200 so Resend knows the webhook was handled.
     */
    return response.status(200).json({
      received: true,
      eventId: svixId,
      eventType: event.type,
    });
  } catch (error) {
    console.error(
      "Resend webhook verification failed",
      error,
    );

    return response.status(400).json({
      error: "Invalid webhook",
    });
  }
}

function getHeader(
  request: NextApiRequest,
  name: string,
) {
  const value = request.headers[name];

  return Array.isArray(value) ? value[0] : value;
}

async function readRawBody(
  request: NextApiRequest,
): Promise<string> {
  const chunks: Uint8Array[] = [];

  for await (const rawChunk of request) {
    const chunk = rawChunk as unknown;

    if (typeof chunk === "string") {
      chunks.push(Buffer.from(chunk));
      continue;
    }

    if (chunk instanceof Uint8Array) {
      chunks.push(chunk);
      continue;
    }

    throw new TypeError(
      "Webhook request contained an unsupported body chunk",
    );
  }

  return Buffer.concat(chunks).toString("utf8");
}