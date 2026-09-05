import type { Prisma } from "generated/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { db } from "@/server/db";
import { settlePaidOrder } from "@/server/payment-settlement";
import { verifyPayPalWebhook } from "@/server/paypal";

const EventSchema = z
  .object({
    id: z.string(),
    event_type: z.string(),
    resource: z.record(z.string(), z.unknown()),
  })
  .passthrough();

const text = (value: unknown) =>
  typeof value === "string" ? value : undefined;

const record = (value: unknown): Record<string, unknown> | undefined =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : undefined;

const toPrismaJson = (value: unknown): Prisma.InputJsonValue =>
  JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }

  const parsed = EventSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      message: "Invalid PayPal webhook payload",
    });
  }

  const verified = await verifyPayPalWebhook(req.headers, parsed.data);

  if (!verified) {
    return res.status(401).json({
      ok: false,
      message: "Invalid PayPal signature",
    });
  }

  const event = parsed.data;
  const resource = event.resource;

  let referenceId = text(resource.custom_id);
  const supplementaryData = record(resource.supplementary_data);
  const relatedIds = record(supplementaryData?.related_ids);
  const relatedOrderId = text(relatedIds?.order_id);

  if (!referenceId && relatedOrderId) {
    const relatedOrder = await db.order.findFirst({
      where: { checkoutId: relatedOrderId },
      select: { referenceId: true },
    });
    referenceId = relatedOrder?.referenceId;
  }

  try {
    const duplicate = await db.webhookLog.findUnique({
      where: { externalEventId: event.id },
    });
    if (duplicate) return res.status(200).json({ ok: true, duplicate: true });

    const order = referenceId
      ? await db.order.findUnique({ where: { referenceId } })
      : null;

    await db.webhookLog.create({
      data: {
        provider: "PAYPAL",
        externalEventId: event.id,
        event: event.event_type,
        referenceId,
        status: text(resource.status),
        payload: toPrismaJson(event),
        headers: toPrismaJson(req.headers),
        orderId: order?.id,
      },
    });

    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED" && referenceId) {
      const breakdown = record(resource.seller_receivable_breakdown);
      const fee = record(breakdown?.paypal_fee);
      const feeValue = Number(text(fee?.value) ?? 0);
      if (order && Number.isFinite(feeValue)) {
        await db.order.update({ where: { id: order.id }, data: { paypalFee: Math.round(feeValue * 100) } });
      }
      await settlePaidOrder(referenceId);
    }

    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.error("PayPal webhook processing failed:", error);

    return res.status(500).json({
      ok: false,
      message: "PayPal webhook processing failed",
    });
  }
}
