import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { capturePayPalOrder, createPayPalOrder } from "@/server/paypal";
import { settlePaidOrder } from "@/server/payment-settlement";

export const paypalRouter = createTRPCRouter({
  createCheckout: protectedProcedure
    .input(z.object({ couponId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const cart = await ctx.db.cart.findMany({
        where: { userId },
        select: {
          price: true,
          is_album: true,
          trackId: true,
          albumId: true,
          track: { select: { userId: true } },
          album: { select: { userId: true } },
        },
      });

      if (cart.length === 0) throw new Error("Cart is empty");

      const subtotal = cart.reduce((sum, item) => sum + Number(item.price), 0);
      const referenceId = crypto.randomUUID();

      if (subtotal === 0) {
        await ctx.db.$transaction(async (prisma) => {
          const order = await prisma.order.create({
            data: {
              referenceId,
              userId,
              amount: 0,
              discountValue: 0,
              discountAmount: 0,
              finalAmount: 0,
              currency: "USD",
              status: "PAID",
              paidAt: new Date(),
              checkoutId: referenceId,
            },
          });

          await prisma.orderPurchase.createMany({
            data: cart.map((item) => ({
              orderId: order.id,
              uploaderId: item.is_album
                ? item.album?.userId
                : item.track?.userId,
              price: 0,
              priceDiscount: 0,
              finalPrice: 0,
              is_album: item.is_album,
              trackId: item.is_album ? null : item.trackId,
              albumId: item.is_album ? item.albumId : null,
            })),
          });

          await prisma.cart.deleteMany({ where: { userId } });
        });

        return { kind: "FREE" as const, redirectUrl: "/account?type=orders" };
      }

      let coupon = null;
      let discountAmount = 0;

      if (input.couponId) {
        coupon = await ctx.db.coupon.findUnique({
          where: { id: input.couponId },
        });
        if (!coupon) throw new Error("Coupon not found");
        const now = new Date();
        if (!coupon.isActive) throw new Error("This coupon is inactive");
        if (coupon.startsAt && coupon.startsAt > now) {
          throw new Error("This coupon is not active yet");
        }
        if (coupon.expiresAt && coupon.expiresAt <= now) {
          throw new Error("This coupon has expired");
        }
        if (coupon.minSpend != null && subtotal < Number(coupon.minSpend)) {
          throw new Error("The minimum order requirement was not met.");
        }

        discountAmount =
          coupon.type === "PERCENT"
            ? Math.floor((subtotal * Number(coupon.value)) / 100)
            : Number(coupon.value) * 100;
      }

      const finalAmount = Math.max(subtotal - discountAmount, 0);
      if (finalAmount === 0)
        throw new Error("This coupon cannot make a paid order free.");

      const discountedCart = cart.map((item, index) => {
        const price = Number(item.price);
        const previous = cart
          .slice(0, index)
          .reduce(
            (sum, entry) =>
              sum +
              Math.floor((Number(entry.price) / subtotal) * discountAmount),
            0,
          );
        const discount =
          index === cart.length - 1
            ? discountAmount - previous
            : Math.floor((price / subtotal) * discountAmount);

        return {
          price,
          discount: Math.min(discount, price),
          uploaderId: item.is_album ? item.album?.userId : item.track?.userId,
          is_album: item.is_album,
          trackId: item.trackId,
          albumId: item.albumId,
        };
      });

      const paypalOrder = await createPayPalOrder({
        referenceId,
        amountInCents: finalAmount,
        currency: "USD",
      });
      await ctx.db.$transaction(async (prisma) => {
        const order = await prisma.order.create({
          data: {
            referenceId,
            userId,
            amount: subtotal,
            discountType: coupon?.type ?? null,
            discountValue: coupon ? Number(coupon.value) : 0,
            discountAmount,
            finalAmount,
            currency: "USD",
            status: "PENDING",
            checkoutId: paypalOrder.id,
            expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            couponId: coupon?.id ?? null,
          },
        });

        await prisma.orderPurchase.createMany({
          data: discountedCart.map((item) => ({
            orderId: order.id,
            uploaderId: item.uploaderId ?? null,
            price: item.price,
            priceDiscount: item.discount,
            finalPrice: Math.max(item.price - item.discount, 0),
            is_album: item.is_album,
            trackId: item.is_album ? null : item.trackId,
            albumId: item.is_album ? item.albumId : null,
          })),
        });
        await prisma.cart.deleteMany({ where: { userId } });
      });

      return { kind: "PAYPAL" as const, orderId: paypalOrder.id };
    }),

  captureCheckout: protectedProcedure
    .input(z.object({ orderId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findFirst({
        where: { checkoutId: input.orderId, userId: ctx.session.user.id },
      });
      if (!order) throw new Error("Order not found");
      if (order.status === "PAID") return { ok: true };

      const capture = await capturePayPalOrder(input.orderId);
      if (capture.status !== "COMPLETED") {
        throw new Error("PayPal payment was not completed");
      }
      await settlePaidOrder(order.referenceId);
      return { ok: true };
    }),

  resumeCheckout: protectedProcedure
    .input(z.object({ referenceId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findFirst({
        where: {
          referenceId: input.referenceId,
          userId: ctx.session.user.id,
        },
      });

      if (!order) throw new Error("Order not found");
      if (order.status !== "PENDING") {
        throw new Error("Only pending orders can be paid");
      }
      if (order.expiredAt && order.expiredAt <= new Date()) {
        await ctx.db.order.update({
          where: { id: order.id },
          data: { status: "EXPIRED" },
        });
        throw new Error("This pending order has expired");
      }
      if (order.finalAmount <= 0) {
        throw new Error("This order does not require payment");
      }

      const paypalOrder = await createPayPalOrder({
        referenceId: order.referenceId,
        amountInCents: order.finalAmount,
        currency: order.currency,
        requestId: `${order.referenceId}-${crypto.randomUUID()}`,
      });

      await ctx.db.order.update({
        where: { id: order.id },
        data: {
          checkoutId: paypalOrder.id,
          checkoutUrl: null,
          failedReason: null,
          expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      return { orderId: paypalOrder.id };
    }),

  cancelCheckout: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findFirst({
        where: { referenceId: input.orderId, userId: ctx.session.user.id },
      });
      if (!order) throw new Error("Order not found");
      if (order.status === "PAID")
        throw new Error("Cannot cancel a paid order");
      if (["CANCELLED", "EXPIRED"].includes(order.status)) return { ok: true };

      await ctx.db.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED", cancelledAt: new Date() },
      });
      return { ok: true };
    }),
});
