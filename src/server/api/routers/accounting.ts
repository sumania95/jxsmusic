import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import z from "zod";

export const accountingRouter = createTRPCRouter({
  overview: protectedProcedure.query(async ({ ctx }) => {
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
        message: "You do not have permission to view accounting.",
      });
    }

    const [
      paid,
      pending,
      refunded,
      creditSales,
      recentOrders,
      recentAcquisitions,
    ] = await Promise.all([
      ctx.db.order.aggregate({
        where: {
          status: "PAID",
          currency: "USD",
        },
        _sum: {
          finalAmount: true,
          paypalFee: true,
        },
        _count: {
          id: true,
        },
      }),

      ctx.db.order.aggregate({
        where: {
          status: "PENDING",
          currency: "USD",
        },
        _sum: {
          finalAmount: true,
        },
        _count: {
          id: true,
        },
      }),

      ctx.db.order.aggregate({
        where: {
          status: "REFUNDED",
          currency: "USD",
        },
        _sum: {
          finalAmount: true,
        },
        _count: {
          id: true,
        },
      }),

      ctx.db.order.aggregate({
        where: {
          status: "PAID",
          purpose: "CREDIT_PACK",
          currency: "USD",
        },
        _sum: {
          finalAmount: true,
          creditAmount: true,
        },
        _count: {
          id: true,
        },
      }),

      ctx.db.order.findMany({
        take: 20,
        where:{
          status:"PAID"
        },
        orderBy: {
          createdAt: "desc",
        },
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
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),

      /*
       * The newest track acquisitions.
       *
       * Each DownloadTrack row records whether the customer originally
       * acquired the track through CART or CREDIT.
       */
      ctx.db.downloadTrack.findMany({
        take: 20,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          acquisitionType: true,
          creditsSpent: true,
          createdAt: true,

          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          track: {
            select: {
              id: true,
              artist: true,
              title: true,
              filetype: true,
            },
          },

          order: {
            select: {
              id: true,
              referenceId: true,
              finalAmount: true,
              currency: true,
              status: true,
            },
          },
        },
      }),
    ]);

    return {
      paid,
      pending,
      refunded,
      creditSales,
      recentOrders,
      recentAcquisitions,
    };
  }),
  getAll: protectedProcedure
    .input(
      z.object({
        search: z.string().nullish(),
        take: z.number().max(100),
        skip: z.number(),
      })
    ).query(async ({ ctx, input })=>{
      const searchTerms = (input.search ?? "").trim().split(/\s+/).filter(Boolean);

      const filter = {
        ...(searchTerms.length ? { 
          AND: searchTerms.map((term) => ({ 
            track:{
              keywords: { contains: term } 
            }
          })) } : {}),
      }
      const count = await ctx.db.downloadTrack.count({
        where:filter
      })
      const tracks =  await ctx.db.downloadTrack.findMany({
        take:input.take,
        skip:input.skip,
        where:filter,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          acquisitionType: true,
          creditsSpent: true,
          createdAt: true,

          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          track: {
            select: {
              id: true,
              artist: true,
              title: true,
              filetype: true,
              is_explicit:true,
            },
          },

          order: {
            select: {
              id: true,
              referenceId: true,
              finalAmount: true,
              currency: true,
              status: true,
            },
          },
        },
    })
    return {
      count,
      tracks
    }
  }),
});