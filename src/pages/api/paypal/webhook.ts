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

const text = (
  value: unknown,
): string | undefined =>
  typeof value === "string"
    ? value
    : undefined;

const record = (
  value: unknown,
): Record<string, unknown> | undefined =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;

const toPrismaJson = (
  value: unknown,
): Prisma.InputJsonValue =>
  JSON.parse(
    JSON.stringify(value),
  ) as Prisma.InputJsonValue;

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
    const parsed = EventSchema.safeParse(
      req.body,
    );

    if (!parsed.success) {
      console.error(
        "Invalid PayPal webhook payload",
        parsed.error.flatten(),
      );

      return res.status(400).json({
        ok: false,
        message:
          "Invalid PayPal webhook payload",
      });
    }

    /*
     * Verify the original request body.
     * Do not verify parsed.data because parsing can
     * potentially alter the original payload structure.
     */
    const verified =
      await verifyPayPalWebhook(
        req.headers,
        req.body,
      );

    if (!verified) {
      console.error(
        "Invalid PayPal webhook signature",
        {
          eventId: parsed.data.id,
          eventType:
            parsed.data.event_type,
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

    const event = parsed.data;
    const resource = event.resource;

    let referenceId = text(
      resource.custom_id,
    );

    const supplementaryData = record(
      resource.supplementary_data,
    );

    const relatedIds = record(
      supplementaryData?.related_ids,
    );

    const relatedOrderId = text(
      relatedIds?.order_id,
    );

    /*
     * Capture webhooks normally contain the PayPal
     * order ID in supplementary_data.related_ids.
     */
    if (!referenceId && relatedOrderId) {
      const relatedOrder =
        await db.order.findFirst({
          where: {
            checkoutId: relatedOrderId,
          },
          select: {
            referenceId: true,
          },
        });

      referenceId =
        relatedOrder?.referenceId;
    }

    const order = referenceId
      ? await db.order.findUnique({
          where: {
            referenceId,
          },
        })
      : null;

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
     * Do not return early for duplicate events.
     * A previous attempt may have created the log
     * and then failed during settlement.
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
        headers: toPrismaJson({
          transmissionId:
            req.headers[
              "paypal-transmission-id"
            ] ?? null,
          transmissionTime:
            req.headers[
              "paypal-transmission-time"
            ] ?? null,
          authAlgorithm:
            req.headers[
              "paypal-auth-algo"
            ] ?? null,
          certificateUrl:
            req.headers[
              "paypal-cert-url"
            ] ?? null,
        }),
        orderId: order?.id,
      },
      update: {
        referenceId,
        status:
          text(resource.status) ?? null,
        payload: toPrismaJson(event),
        orderId: order?.id,
      },
    });

    switch (event.event_type) {
      case "CHECKOUT.ORDER.APPROVED": {
        /*
         * Approval does not mean payment completed.
         * Keep the order pending.
         */
        break;
      }

      case "PAYMENT.CAPTURE.PENDING": {
        if (order?.status === "PENDING") {
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
          throw new Error(
            `Completed PayPal event ${event.id} has no matching order`,
          );
        }

        const breakdown = record(
          resource.seller_receivable_breakdown,
        );

        const fee = record(
          breakdown?.paypal_fee,
        );

        const feeValue = Number(
          text(fee?.value) ?? "0",
        );

        if (Number.isFinite(feeValue)) {
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
         * This function must be idempotent so that
         * retries do not grant credits twice.
         */
        await settlePaidOrder(referenceId);

        break;
      }

      case "PAYMENT.CAPTURE.DENIED": {
        if (
          order &&
          order.status !== "PAID" &&
          order.status !== "REFUNDED"
        ) {
          const statusDetails = record(
            resource.status_details,
          );

          await db.order.update({
            where: {
              id: order.id,
            },
            data: {
              status: "FAILED",
              failedReason:
                text(statusDetails?.reason) ??
                "PayPal capture denied",
            },
          });
        }

        break;
      }

      case "PAYMENT.CAPTURE.REFUNDED": {
        if (order) {
          await db.order.update({
            where: {
              id: order.id,
            },
            data: {
              status: "REFUNDED",
              refundedAt: new Date(),
            },
          });
        }

        break;
      }

      default: {
        console.log(
          "Ignored PayPal webhook event",
          {
            eventId: event.id,
            eventType:
              event.event_type,
          },
        );
      }
    }

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

    return res.status(500).json({
      ok: false,
      message:
        "PayPal webhook processing failed",
    });
  }
}