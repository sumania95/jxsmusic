import type { NextApiRequest, NextApiResponse } from "next";

import { db } from "@/server/db";
import { capturePayPalOrder } from "@/server/paypal";
import { settlePaidOrder } from "@/server/payment-settlement";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method Not Allowed" });

  const paypalOrderId =
    typeof req.query.token === "string" ? req.query.token : "";
  if (!paypalOrderId)
    return res.redirect(302, `${appUrl}/my-orders?payment=missing`);

  const order = await db.order.findFirst({
    where: { checkoutId: paypalOrderId },
  });
  if (!order) return res.redirect(302, `${appUrl}/my-orders?payment=unknown`);

  try {
    if (order.status !== "PAID") {
      const capture = await capturePayPalOrder(paypalOrderId);
      if (capture.status !== "COMPLETED")
        throw new Error("Payment was not completed");
      await settlePaidOrder(order.referenceId);
    }
    return res.redirect(302, `${appUrl}/my-orders?payment=success`);
  } catch {
    await db.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    return res.redirect(302, `${appUrl}/my-orders?payment=failed`);
  }
}
