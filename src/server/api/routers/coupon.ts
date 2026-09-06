import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "generated/prisma";
import { z } from "zod";

function startOfDayPH(date: Date) {
  const d = new Date(date)
  d.setUTCHours(16, 0, 0, 0) // 00:00 PH
  return d
}

function endOfDayPH(date: Date) {
  const d = new Date(date)

  // 🔥 ADD +1 DAY FIRST
  d.setUTCDate(d.getUTCDate() + 1)

  // then set to end of PH day
  d.setUTCHours(15, 59, 59, 999) // 23:59:59 PH

  return d
}



export const couponRouter = createTRPCRouter({
  getActiveCoupons: publicProcedure.query(async ({ ctx }) => {
    const now = new Date()

    return ctx.db.coupon.findFirst({
      where: {
        isActive: true,
        AND: [
          {
            OR: [
              { startsAt: null },
              { startsAt: { lte: now } },
            ],
          },
          {
            OR: [
              { expiresAt: null },
              { expiresAt: { gte: now } },
            ],
          },
        ],
      },
      orderBy: [
        { value: "desc" },        // highest discount first
        { expiresAt: "asc" },     // soonest expiry wins
      ],
    })
  }),

  applyCode: protectedProcedure
    .input(z.object({
      code: z.string(),
      totalAmount: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      const year = new Date().getFullYear();
      const coupon = await ctx.db.coupon.findUnique({
        where: {
          code_year: {
            code: input.code.toUpperCase(),
            year,
          },
        },
        include: {
          usages: {
            where: { userId: ctx.session.user.id },
          },
        },
      });

      if (!coupon || !coupon.isActive)
        throw new TRPCError({ code: "NOT_FOUND", message: "Invalid coupon" });

      if (coupon.startsAt && coupon.startsAt > new Date())
        throw new TRPCError({ code: "BAD_REQUEST", message: "Coupon not started" });

      if (coupon.expiresAt && coupon.expiresAt < new Date())
        throw new TRPCError({ code: "BAD_REQUEST", message: "Coupon expired" });

      if (coupon.usages.length > 0)
        throw new TRPCError({ code: "FORBIDDEN", message: "Coupon already used" });
      // ✅ example: minimum spend check
      if (coupon.minSpend && input.totalAmount < coupon.minSpend)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Minimum spend is $${coupon.minSpend / 100}`,
        });
      return coupon;
    }),
  getId: protectedProcedure
    .input(
      z.object({
        couponId: z.string().optional(), // coupon is optional
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.coupon.findUnique({
        where: {
          id: input.couponId
        },
        select: {
          id: true,
          code: true,
          type: true,
          value: true
        }
      })
    }),

  getAll: protectedProcedure
    .input(z.object({
      search: z.string().nullish(),
      sort: z.string().default("desc"),
      take: z.number().max(100),
      skip: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const filter = {
        code: {
          contains: input.search ?? ""
        },
      }
      const count = await ctx.db.coupon.aggregate({
        where: filter,
        _count: {
          id: true,
        },
      })
      const coupons = await ctx.db.coupon.findMany({
        take: input.take,
        skip: input.skip,
        orderBy: [{
          startsAt: input.sort === "desc" ? "desc" : "asc",
        },],
        where: filter,
        select: {
          id: true,
          name: true,
          code: true,
          year: true,
          type: true,
          isActive: true,
          minSpend: true,
          value: true,
          startsAt: true,
          expiresAt: true
        }
      });
      return {
        count: count,
        coupons: coupons
      }
    }),
  delete: publicProcedure
    .input(z.object({
      id: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await ctx.db.coupon.delete({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      code: z.string().min(1),
      value: z.number(),
      year: z.number().min(4),
      minSpend: z.number(),
      startsAt: z.date(),
      expiresAt: z.date(),
    }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // 🌍 Get user timezone (fallback PH)
      const startsAt = startOfDayPH(input.startsAt)
      const expiresAt = endOfDayPH(input.expiresAt)

      console.log("START (UTC)", startsAt.toISOString())
      console.log("END (UTC)", expiresAt.toISOString())

      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await ctx.db.coupon.create({
        data: {
          name: input.name,
          code: input.code,
          value: input.value,
          year: input.year,
          minSpend: input.minSpend,
          startsAt,
          expiresAt,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z
        .object({
          id: z.string().cuid(),
          name: z.string().trim().min(1).max(100),
          code: z.string().trim().min(1).max(50),
          value: z.number().int().min(1).max(100),
          minSpend: z.number().int().min(0),
          year: z.number().int().min(2000).max(2200),
          startsAt: z.date(),
          startsAtChanged: z.boolean(),
          expiresAt: z.date(),
          expiresAtChanged: z.boolean(),
          isActive: z.boolean(),
        })
        .refine(
          (data) => data.expiresAt >= data.startsAt,
          {
            path: ["expiresAt"],
            message: "Expiry must be after start date",
          },
        ),
    )
    .mutation(async ({ input, ctx }) => {
      // simulate a slow db call
      // 🌍 Get user timezone (fallback PH)
      const startsAt = startOfDayPH(input.startsAt)
      const expiresAt = endOfDayPH(input.expiresAt)

      console.log("START (UTC)", startsAt.toISOString())
      console.log("END (UTC)", expiresAt.toISOString())
      const operator = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          is_admin: true,
          is_superadmin: true,
        },
      });

      if (!operator?.is_admin && !operator?.is_superadmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Administrator access required.",
        });
      }

      const existingCoupon = await ctx.db.coupon.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
        },
      });

      if (!existingCoupon) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Coupon not found.",
        });
      }

      try {
        return await ctx.db.coupon.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            code: input.code.toUpperCase(),
            value: input.value,
            minSpend: input.minSpend,
            year: input.year,
            ...(input.startsAtChanged
              ? { startsAt: input.startsAt }
              : {}),

            ...(input.expiresAtChanged
              ? { expiresAt: input.expiresAt }
              : {}),
            isActive: input.isActive,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This coupon code is already in use.",
          });
        }

        throw error;
      }
    }),
})