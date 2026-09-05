import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { formatTrackTitle } from "@/lib/utils";

export const adminTrackRouter = createTRPCRouter({
    updateTrackAdmin: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        artist: z.string(),
        is_disabled:z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // CREATE SNIPPIT
      const track = await ctx.db.track.findUnique({
        where:{
          id:input.id
        }
      })
      if(!track) throw new TRPCError({
        code:"NOT_FOUND",
        message:"Update Track Not Found"
      })
      // Generate keywords
      const keywords = `${input.artist} - ${formatTrackTitle(input.title,track.is_explicit)} ${track.in_key} ${track.bpm_start}-${track.bpm_end} ${input.artist} ${formatTrackTitle(input.title,track.is_explicit)} ${track.in_key} ${track.bpm_start}-${track.bpm_end} ${input.title} - ${input.artist} ${input.title} ${input.artist}`;
      // Update track
      const updatedTrack = await ctx.db.track.update({
        where: { id: input.id },
        data: {
          title: input.title,
          artist: input.artist,
          keywords,
          is_disabled: input.is_disabled,
        },
      });
      return updatedTrack;
    }),

    getIdTrackAdmin: protectedProcedure
    .input(z.object({
      id:z.string(), 
    }))
    .query(async({ ctx , input }) => {
        return await ctx.db.track.findUnique({
          where: { 
            id: input.id,
          },
          select:{
            id:true,
            title:true,
            artist:true,
            is_disabled:true,
          }
        });
    }),
    countNoPreviewKey: protectedProcedure
    .query(async ({ ctx }) => {
        const count = await ctx.db.track.aggregate({
            where: {
                preview_key: null,
                is_published:true
            },
            _count: {
            id: true,
            },
        })
        return {
        count: count,
        }
    }),
    updatePreviewKey: protectedProcedure
    .mutation(async ({ ctx }) => {
        const tracks = await ctx.db.track.findMany({
            where: {
                preview_key: null,
                is_published:true
            },
            select: {
                id: true,
                filetype: true,
            },
            take: 20,
        })

        if (tracks.length === 0) {
        return { updated: 0 }
        }

        const result = await ctx.db.$transaction(
        tracks.map((track) => {
            const isVideo = track.filetype?.startsWith('video')

            return ctx.db.track.update({
                where: { id: track.id },
                data: {
                    preview_key: isVideo
                    ? `file/${track.id}.mp4`
                    : `${track.id}.mp3`,
                },
            })
        })
        )

        return {
        updated: result.length,
        tracks: result,
        }
    }),
})