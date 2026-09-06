import type { Prisma } from "generated/prisma";
import type {
  NextApiRequest,
  NextApiResponse,
} from "next";
import { z } from "zod";

import { db } from "@/server/db";
import { settlePaidOrder } from "@/server/payment-settlement";
import { verifyPayPalWebhook } from "@/server/paypal";

const EventSchema = z
  .object({
    id: z.string().min(1),
    event_type: z.string().min(1),
    resource: z.record(
      z.string(),
      z.unknown(),
    ),
  })
  .passthrough();

type PayPalEvent = z.infer<
  typeof EventSchema
>;

function text(
  value: unknown,
): string | undefined {
  return typeof value === "string"
    ? value
    : undefined;
}

function record(
  value: unknown,
): Record<string, unknown> | undefined {
  return typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function toPrismaJson(
  value: unknown,
): Prisma.InputJsonValue {
  return JSON.parse(
    JSON.stringify(value),
  ) as Prisma.InputJsonValue;
}

/*
 * Avoid saving every incoming request header.
 * Store only useful, non-secret PayPal metadata.
 */
function paypalHeadersForLog(
  headers: NextApiRequest["headers"],
) {
  return {
    transmissionId:
      headers["paypal-transmission-id"] ?? null,
    transmissionTime:
      headers["paypal-transmission-time"] ?? null,
    authAlgorithm:
      headers["paypal-auth-algo"] ?? null,
    certificateUrl:
      headers["paypal-cert-url"] ?? null,
    userAgent:
      headers["user-agent"] ?? null,
  };
}

async function resolveReferenceId(
  event: PayPalEvent,
): Promise<string | undefined> {
  const resource = event.resource;

  /*
   * Capture events can contain custom_id directly.
   */
  const customId = text(
    resource.custom_id,
  );

  if (customId) {
    return customId;
  }

  /*
   * Capture events normally provide the PayPal order ID here:
   *
   * resource.supplementary_data.related_ids.order_id
   */
  const supplementaryData = record(
    resource.supplementary_data,
  );

  const relatedIds = record(
    supplementaryData?.related_ids,
  );

  const relatedOrderId = text(
    relatedIds?.order_id,
  );

  if (relatedOrderId) {
    const order = await db.order.findFirst({
      where: {
        checkoutId: relatedOrderId,
      },
      select: {
        referenceId: true,
      },
    });

    if (order) {
      return order.referenceId;
    }
  }

  /*
   * CHECKOUT.ORDER events use resource.id as the
   * PayPal order ID.
   */
  if (
    event.event_type.startsWith(
      "CHECKOUT.ORDER.",
    )
  ) {
    const checkoutId = text(resource.id);

    if (checkoutId) {
      const order = await db.order.findFirst({
        where: {
          checkoutId,
        },
        select: {
          referenceId: true,
        },
      });

      if (order) {
        return order.referenceId;
      }
    }
  }

  return undefined;
}

async function processPayPalEvent({
  event,
  referenceId,
}: {
  event: PayPalEvent;
  referenceId?: string;
}) {
  const resource = event.resource;

  const order = referenceId
    ? await db.order.findUnique({
        where: {
          referenceId,
        },
      })
    : null;

  switch (event.event_type) {
    /*
     * Approval is not proof that the capture completed.
     * Do not grant tracks or credits here.
     */
    case "CHECKOUT.ORDER.APPROVED": {
      if (order?.status === "PENDING") {
        await db.order.update({
          where: {
            id: order.id,
          },
          data: {
            checkoutId:
              text(resource.id) ??
              order.checkoutId,
          },
        });
      }

      break;
    }

    case "PAYMENT.CAPTURE.PENDING": {
      if (!order) {
        console.warn(
          "Pending PayPal capture has no matching order",
          {
            eventId: event.id,
            referenceId,
          },
        );

        break;
      }

      /*
       * Do not change an already completed/refunded
       * order back to PENDING.
       */
      if (order.status === "PENDING") {
        await db.order.update({
          where: {
            id: order.id,
          },
          data: {
            status: "PENDING",
          },
        });
      }

      break;
    }

    case "PAYMENT.CAPTURE.COMPLETED": {
      if (!referenceId || !order) {
        /*
         * Return 500 so PayPal retries instead of
         * silently leaving the order pending.
         */
        throw new Error(
          `Completed PayPal capture ${event.id} has no matching order`,
        );
      }

      const breakdown = record(
        resource.seller_receivable_breakdown,
      );

      const paypalFee = record(
        breakdown?.paypal_fee,
      );

      const feeText = text(paypalFee?.value);
      const feeValue =
        feeText !== undefined
          ? Number(feeText)
          : undefined;

      if (
        feeValue !== undefined &&
        Number.isFinite(feeValue)
      ) {
        await db.order.update({
          where: {
            id: order.id,
          },
          data: {
            paypalFee: Math.round(
              feeValue * 100,
            ),
          },
        });
      }

      /*
       * settlePaidOrder must be idempotent because
       * PayPal can deliver the same event more than once.
       */
      await settlePaidOrder(referenceId);

      break;
    }

    case "PAYMENT.CAPTURE.DENIED": {
      if (!order) {
        console.warn(
          "Denied PayPal capture has no matching order",
          {
            eventId: event.id,
            referenceId,
          },
        );

        break;
      }

      /*
       * Never downgrade an already paid/refunded order
       * because of a late or duplicated event.
       */
      if (
        order.status !== "PAID" &&
        order.status !== "REFUNDED"
      ) {
        const statusDetails = record(
          resource.status_details,
        );

        const reason =
          text(statusDetails?.reason) ??
          "PayPal capture denied";

        await db.order.update({
          where: {
            id: order.id,
          },
          data: {
            status: "FAILED",
            failedReason: reason,
          },
        });
      }

      break;
    }

    case "PAYMENT.CAPTURE.REFUNDED": {
      if (!order) {
        /*
         * Refund resources may only contain a capture ID.
         * If this warning occurs, store the PayPal capture
         * ID on Order when handling COMPLETED, then resolve
         * refunds using that value.
         */
        console.warn(
          "Refunded PayPal capture has no matching order",
          {
            eventId: event.id,
            referenceId,
          },
        );

        break;
      }

      await db.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: "REFUNDED",
          refundedAt: new Date(),
        },
      });

      break;
    }

    default: {
      console.log(
        "Ignored PayPal webhook event",
        {
          eventId: event.id,
          eventType: event.event_type,
        },
      );
    }
  }

  return order;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      ok: false,
      message: "Method Not Allowed",
    });
  }

  try {
    /*
     * Validate the event before sending it to PayPal's
     * verification endpoint.
     */
    const parsed = EventSchema.safeParse(
      req.body,
    );

    if (!parsed.success) {
      console.error(
        "Invalid PayPal webhook payload",
        {
          issues: parsed.error.flatten(),
        },
      );

      return res.status(400).json({
        ok: false,
        message:
          "Invalid PayPal webhook payload",
      });
    }

    const event = parsed.data;

    /*
     * Verify the signature before reading or changing
     * application data.
     */
    const verified =
      await verifyPayPalWebhook(
        req.headers,
        event,
      );

    if (!verified) {
      console.error(
        "Invalid PayPal webhook signature",
        {
          eventId: event.id,
          eventType: event.event_type,
          hasTransmissionId: Boolean(
            req.headers[
              "paypal-transmission-id"
            ],
          ),
          hasTransmissionTime: Boolean(
            req.headers[
              "paypal-transmission-time"
            ],
          ),
          hasTransmissionSignature:
            Boolean(
              req.headers[
                "paypal-transmission-sig"
              ],
            ),
          hasCertificateUrl: Boolean(
            req.headers["paypal-cert-url"],
          ),
          hasAuthAlgorithm: Boolean(
            req.headers["paypal-auth-algo"],
          ),
        },
      );

      return res.status(401).json({
        ok: false,
        message:
          "Invalid PayPal signature",
      });
    }

    const resource = event.resource;

    const referenceId =
      await resolveReferenceId(event);

    const order = referenceId
      ? await db.order.findUnique({
          where: {
            referenceId,
          },
          select: {
            id: true,
          },
        })
      : null;

    /*
     * Check whether this is a retry, but do not return
     * early. A previous delivery might have created the
     * log and then failed during settlement.
     */
    const existingLog =
      await db.webhookLog.findUnique({
        where: {
          externalEventId: event.id,
        },
        select: {
          id: true,
        },
      });

    /*
     * Upsert makes logging idempotent.
     */
    await db.webhookLog.upsert({
      where: {
        externalEventId: event.id,
      },
      create: {
        provider: "PAYPAL",
        externalEventId: event.id,
        event: event.event_type,
        referenceId,
        status:
          text(resource.status) ?? null,
        payload: toPrismaJson(event),
        headers: toPrismaJson(
          paypalHeadersForLog(req.headers),
        ),
        orderId: order?.id,
      },
      update: {
        event: event.event_type,
        referenceId,
        status:
          text(resource.status) ?? null,
        payload: toPrismaJson(event),
        headers: toPrismaJson(
          paypalHeadersForLog(req.headers),
        ),
        orderId: order?.id,
      },
    });

    /*
     * Process both new events and retries.
     * Each operation must remain idempotent.
     */
    await processPayPalEvent({
      event,
      referenceId,
    });

    return res.status(200).json({
      ok: true,
      duplicate: Boolean(existingLog),
      eventId: event.id,
      eventType: event.event_type,
    });
  } catch (error) {
    console.error(
      "PayPal webhook processing failed",
      error,
    );

    /*
     * Returning 500 tells PayPal that processing failed
     * and the event should be retried.
     */
    return res.status(500).json({
      ok: false,
      message:
        "PayPal webhook processing failed",
    });
  }
}