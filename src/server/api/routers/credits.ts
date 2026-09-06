import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { createPayPalOrder } from "@/server/paypal";

export const CREDIT_PACK_PRICE = 20_000;
export const CREDIT_PACK_SIZE = 180;

const accountingProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const user = await ctx.db.user.findUnique({
    where: { id: ctx.session.user.id },
    select: {
      is_admin: true,
      is_superadmin: true,
    },
  });

  if (!user?.is_admin && !user?.is_superadmin) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next({ ctx });
});

export const creditsRouter = createTRPCRouter({
  balance: protectedProcedure.query(({ ctx }) =>
    ctx.db.user.findUniqueOrThrow({ where: { id: ctx.session.user.id }, select: { credit: true } }),
  ),

  createCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    const referenceId = crypto.randomUUID();
    const paypal = await createPayPalOrder({ referenceId, amountInCents: CREDIT_PACK_PRICE, currency: "USD" });
    await ctx.db.order.create({
      data: {
        referenceId,
        userId: ctx.session.user.id,
        amount: CREDIT_PACK_PRICE,
        finalAmount: CREDIT_PACK_PRICE,
        purpose: "CREDIT_PACK",
        creditAmount: CREDIT_PACK_SIZE,
        currency: "USD",
        status: "PENDING",
        checkoutId: paypal.id,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    return { orderId: paypal.id };
  }),

  // customers: accountingProcedure.query(async ({ ctx }) => {
  //   return ctx.db.user.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, credit: true } });
  // }),

  // adjust: accountingProcedure
  //   .input(z.object({ userId: z.string(), delta: z.number().int().min(-100000).max(100000) }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.$transaction(async (db) => {
  //       const user = await db.user.findUniqueOrThrow({ where: { id: input.userId }, select: { credit: true } });
  //       const credit = user.credit + input.delta;
  //       if (credit < 0) throw new TRPCError({ code: "BAD_REQUEST", message: "Credit balance cannot be negative" });
  //       return db.user.update({ where: { id: input.userId }, data: { credit }, select: { id: true, credit: true } });
  //     });
  //   }),
});
