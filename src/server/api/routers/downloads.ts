import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
const CURRENT_YEAR = new Date().getFullYear();

const paidAlbumsDownloadsInput = z.object({
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
  .input(
    z.object({
  search: z.string().trim().nullish(),
  take: z.number().int().min(1).max(100).default(20),
  skip: z.number().int().min(0).default(0),
  sort: z.enum(["asc", "desc"]).default("desc"),
  genre: z.array(z.string()),
  tag: z.array(z.string()),
  key: z.array(z.string()),

  bpm_start: z
    .number()
    .min(0)
    .max(200)
    .default(0),

  bpm_end: z
    .number()
    .min(0)
    .max(200)
    .default(200),
  filetypes: z
    .array(z.string())
    .optional(),

  explicit: z
    .enum([
      "all",
      "clean",
      "dirty",
    ])
    .default("all"),

  // Mixed In Key energy levels.
  energy: z
    .array(
      z
        .number()
        .int()
        .min(1)
        .max(10),
    )
    .optional(),

  // Release-year range.
  year_start: z
    .number()
    .int()
    .min(1950)
    .max(CURRENT_YEAR)
    .optional(),

  year_end: z
    .number()
    .int()
    .min(1950)
    .max(CURRENT_YEAR)
    .optional(),

}).refine(
    (input) =>
      input.year_start === undefined ||
      input.year_end === undefined ||
      input.year_start <= input.year_end,
    {
      message:
        "Starting year cannot be greater than ending year",
      path: ["year_start"],
    },
  ),
  )
  .query(async ({ ctx, input }) => {
    const audioTypes = [
      "audio/mpeg",
      "audio/mp3",
    ];

    const videoTypes = [
      "video/mp4",
      "video/webm",
      "video/mov",
    ];
    const filetypeFilter =
        input.filetypes?.length === 1
          ? {
            filetype: {
              in:
                input.filetypes[0] ===
                  "audio"
                  ? audioTypes
                  : videoTypes,
            },
          }
          : {};

      const searchTerms = (
        input.search ?? ""
      )
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    const where = {
      order: {
        userId: ctx.session.user.id,
        status: "PAID",
      },

      track:{
        ...filetypeFilter,
        ...(input.explicit === "dirty"
          ? {
            is_explicit: true,
          }
          : input.explicit === "clean"
            ? {
              is_explicit: false,
            }
            : {}),
        ...(searchTerms.length > 0
          ? {
            AND: searchTerms.map(
              (term) => ({
                keywords: {
                  contains: term,
                },
              }),
            ),
          }
          : {}),
        ...(input.genre.length > 0
          ? {
            genre_track: {
              some: {
                genre: {
                  slug: {
                    in: input.genre,
                  },
                },
              },
            },
          }
          : {}),

        ...(input.tag.length > 0
          ? {
            tag_track: {
              some: {
                tag: {
                  slug: {
                    in: input.tag,
                  },
                },
              },
            },
          }
          : {}),

        bpm_start: {
          gte: input.bpm_start,
          lte: input.bpm_end,
        },

        ...(input.key.length > 0
          ? {
            in_key: {
              in: input.key,
            },
          }
          : {}),

        // Optional energy filter.
        ...(input.energy?.length
          ? {
            energy: {
              in: input.energy,
            },
          }
          : {}),

        // Optional release-year range.
        ...(input.year_start !==
          undefined ||
          input.year_end !== undefined
          ? {
            release_year: {
              ...(input.year_start !==
                undefined
                ? {
                  gte:
                    input.year_start,
                }
                : {}),

              ...(input.year_end !==
                undefined
                ? {
                  lte:
                    input.year_end,
                }
                : {}),
            },
          }
          : {}),
      }
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
  .input(paidAlbumsDownloadsInput)
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