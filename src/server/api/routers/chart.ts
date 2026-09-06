import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc"

const chartTypeSchema = z.enum([
  "trending",
  "downloads",
  "previews",
  "new",
])

type ChartType = z.infer<typeof chartTypeSchema>

const getChartOrderBy = (chart: ChartType) => {
  switch (chart) {
    case "downloads":
      return [
        { download_count: "desc" as const },
        { releaseAt: "desc" as const },
      ]

    case "previews":
      return [
        { preview_count: "desc" as const },
        { releaseAt: "desc" as const },
      ]

    case "new":
      return [
        { releaseAt: "desc" as const },
      ]

    case "trending":
    default:
      return [
        { download_count: "desc" as const },
        { preview_count: "desc" as const },
        { releaseAt: "desc" as const },
      ]
  }
}

export const chartRouter = createTRPCRouter({
  tracks: publicProcedure
    .input(
      z.object({
        chart: chartTypeSchema.default("trending"),
        genre: z.string().trim().min(1).optional(),
        tag: z.string().trim().min(1).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.track.findMany({
        where: {
          is_published: true,
          is_reviewed: true,
          is_disabled: false,

          ...(input.genre
            ? {
                genre_track: {
                  some: {
                    genre: {
                      slug: input.genre,
                    },
                  },
                },
              }
            : {}),

          ...(input.tag
            ? {
                tag_track: {
                  some: {
                    tag: {
                      slug: input.tag,
                    },
                  },
                },
              }
            : {}),
        },

        select: {
  id: true,
  title: true,
  artist: true,
  in_key: true,
  energy: true,
  filetype: true,
  preview_key: true,
  bpm_start: true,
  bpm_end: true,
  price: true,
  is_explicit: true,
  release_year: true,
  duration: true,
  releaseAt: true,

  user: {
    select: {
      id: true,
      username: true,
      image: true,
    },
  },

  genre_track: {
    select: {
      genre: {
        select: {
          name: true,
        },
      },
    },
  },
  tag_track: {
    select: {
      tag: {
        select: {
          name: true,
        },
      },
    },
  },
},

        orderBy: getChartOrderBy(input.chart),
        take: 30,
      })
    }),
})