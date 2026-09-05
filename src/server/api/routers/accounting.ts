import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const accountingRouter = createTRPCRouter({
  overview: protectedProcedure.query(async ({ ctx }) => {
    const operator = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { is_admin: true, is_superadmin: true },
    });
    if (!operator?.is_admin && !operator?.is_superadmin) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    const [paid, pending, refunded, creditSales, recentOrders] =
      await Promise.all([
        ctx.db.order.aggregate({
          where: { status: "PAID", currency: "USD" },
          _sum: { finalAmount: true, paypalFee: true },
          _count: { id: true },
        }),
        ctx.db.order.aggregate({
          where: { status: "PENDING", currency: "USD" },
          _sum: { finalAmount: true },
          _count: { id: true },
        }),
        ctx.db.order.aggregate({
          where: { status: "REFUNDED", currency: "USD" },
          _sum: { finalAmount: true },
          _count: { id: true },
        }),
        ctx.db.order.aggregate({
          where: { status: "PAID", purpose: "CREDIT_PACK" },
          _sum: { finalAmount: true, creditAmount: true },
          _count: { id: true },
        }),
        ctx.db.order.findMany({
          take: 20,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            referenceId: true,
            status: true,
            finalAmount: true,
            currency: true,
            purpose: true,
            creditAmount: true,
            paypalFee: true,
            createdAt: true,
            paidAt: true,
            user: { select: { name: true, email: true } },
          },
        }),
      ]);

    return { paid, pending, refunded, creditSales, recentOrders };
  }),
});
