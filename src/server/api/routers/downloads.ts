import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

const paidDownloadsInput = z.object({
  search: z.string().trim().nullish(),
  take: z.number().int().min(1).max(100).default(20),
  skip: z.number().int().min(0).default(0),
  sort: z.enum(["asc", "desc"]).default("desc"),
})
const getSearchTerms = (search?: string | null) =>
  search
    ?.trim()
    .split(/\s+/)
    .filter(Boolean) ?? []
export const downloadsRouter = createTRPCRouter({
  /**
   * Individually purchased tracks from PAID orders.
   */
  getPaidTracks: protectedProcedure
  .input(paidDownloadsInput)
  .query(async ({ ctx, input }) => {
    const terms = getSearchTerms(input.search)

    const where = {
      order: {
        userId: ctx.session.user.id,
        status: "PAID",
      },

      track:
        terms.length > 0
          ? {
              is: {
                AND: terms.map((term) => ({
                  keywords: {
                    contains: term,
                  },
                })),
              },
            }
          : {
              isNot: null,
            },
    }

    const [count, purchases] = await ctx.db.$transaction([
      ctx.db.orderPurchase.count({
        where,
      }),

      ctx.db.orderPurchase.findMany({
        where,
        take: input.take,
        skip: input.skip,

        orderBy: {
          order: {
            createdAt: input.sort,
          },
        },

        select: {
          price: true,

          order: {
            select: {
              id: true,
              referenceId: true,
              checkoutId: true,
              createdAt: true,
            },
          },

          track: {
            select: {
              id: true,
              title: true,
              artist: true,
              in_key: true,
              bpm_end: true,
              bpm_start: true,
              is_explicit: true,
              filetype:true,
              size:true,
            },
          },
        },
      }),
    ])

    return {
      count,
      purchases,
    }
  }),

  /**
   * Purchased albums from PAID orders.
   */
  getPaidAlbums: protectedProcedure
  .input(paidDownloadsInput)
  .query(async ({ ctx, input }) => {
    const terms = getSearchTerms(input.search)

    const where = {
      order: {
        userId: ctx.session.user.id,
        status: "PAID",
      },

      album:
        terms.length > 0
          ? {
              is: {
                AND: terms.map((term) => ({
                  OR: [
                    {
                      name: {
                        contains: term,
                      },
                    },
                    {
                      trackAlbum: {
                        some: {
                          track: {
                            is: {
                              keywords: {
                                contains: term,
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                })),
              },
            }
          : {
              isNot: null,
            },
    }

    const [count, purchases] = await ctx.db.$transaction([
      ctx.db.orderPurchase.count({
        where,
      }),

      ctx.db.orderPurchase.findMany({
        where,
        take: input.take,
        skip: input.skip,

        orderBy: {
          order: {
            createdAt: input.sort,
          },
        },

        select: {
          price: true,

          order: {
            select: {
              id: true,
              referenceId: true,
              checkoutId: true,
              createdAt: true,
            },
          },

          album: {
            select: {
              name: true,

              trackAlbum: {
                orderBy: {
                  track: {
                    title: "asc",
                  },
                },

                select: {
                  track: {
                    select: {
                      id: true,
                      title: true,
                      artist: true,
                      in_key: true,
                      bpm_end: true,
                      bpm_start: true,
                      is_explicit: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ])

    return {
      count,
      purchases,
    }
  }),
})