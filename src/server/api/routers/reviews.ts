import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
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

export const reviewsRouter = createTRPCRouter({
  approved: publicProcedure.query(async ({ ctx }) => {
    const reviews = await ctx.db.review.findMany({
      where: { status: "APPROVED" },
      take: 100,
      orderBy: { approvedAt: "desc" },
      select: {
        id: true,
        rating: true,
        title: true,
        message: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return reviews.sort(() => Math.random() - 0.5).slice(0, 10);
  }),

  create: protectedProcedure
    .input(
      z.object({
        rating: z.number().int().min(1).max(5),
        title: z.string().max(100).optional(),
        message: z.string().min(10).max(1500),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.review.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
          status: "PENDING",
        },
      }),
    ),

  pending: adminProcedure.query(({ ctx }) =>
    ctx.db.review.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ),

  moderate: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["APPROVED", "REJECTED"]),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.review.update({
        where: { id: input.id },
        data: {
          status: input.status,
          approvedAt: input.status === "APPROVED" ? new Date() : null,
        },
      }),
    ),
});