import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

export const trackRelatedRouter = createTRPCRouter({
    getAll: publicProcedure
    .input(z.object({
      take: z.number().max(100),
      skip: z.number(),
      spotifyId:z.array(z.string()),
      id:z.string(),
    }))
    .query(async({ ctx,input }) => {
      const current_date = new Date()
      current_date.setUTCHours(0, 0, 0, 0);
      const filter = {
        id:{
            not:input.id
        },
        is_published:true,
        is_reviewed:true,
        is_disabled:false,
        ...input.spotifyId?{
        spotify_track:{
            some:{
                spotify:{
                    spotifyId:{
                        in:input.spotifyId
                    }
                }
            }
        }
        }:{},
      }
      const count = await ctx.db.track.aggregate({
        where:filter,
        _count: {
          id: true,
        },
      })
      const tracks =  await ctx.db.track.findMany({
          take:input.take,
          skip:input.skip,
          orderBy: [
            { releaseAt: "desc" },
            { title: "asc" },
            { is_explicit: "asc" },
          ],
          where: filter,
          select:{
            id:true,
            title:true,
            artist:true,
            filetype:true,
            price:true,
            is_explicit:true,
            preview_key:true,
            duration:true,
            releaseAt:true,
            in_key:true,
            bpm_start:true,
            bpm_end:true,
            release_year:true,
            genre_track:{
              select:{
                genre:{
                  select:{
                    name:true
                  }
                }
              }
            },
            tag_track:{
              select:{
                tag:{
                  select:{
                    name:true
                  }
                }
              }
            },
            user:{
              select:{
                id:true,
                username:true,
                image:true,
              }
            }
          }
        });
        return {
          count:count,
          tracks:tracks
        }
    }),

    getAllRelatedKey: publicProcedure
    .input(z.object({
      take: z.number().max(100),
      skip: z.number(),
      key:z.array(z.string()),
      id:z.string(),
    }))
    .query(async({ ctx,input }) => {
      const current_date = new Date()
      current_date.setUTCHours(0, 0, 0, 0);
      const filter = {
        id:{
            not:input.id
        },
        is_published:true,
        is_reviewed:true,
        is_disabled:false,
        ...input.key?{
            in_key:{
                in:input.key
            }
        }:{},
      }
      const count = await ctx.db.track.aggregate({
        where:filter,
        _count: {
          id: true,
        },
      })
      const tracks =  await ctx.db.track.findMany({
          take:input.take,
          skip:input.skip,
          orderBy: [
            { releaseAt: "desc" },
            { title: "asc" },
            { is_explicit: "asc" },
          ],
          where: filter,
          select:{
            id:true,
            title:true,
            artist:true,
            filetype:true,
            price:true,
            is_explicit:true,
            preview_key:true,
            duration:true,
            releaseAt:true,
            in_key:true,
            bpm_start:true,
            bpm_end:true,
            release_year:true,
            genre_track:{
              select:{
                genre:{
                  select:{
                    name:true
                  }
                }
              }
            },
            tag_track:{
              select:{
                tag:{
                  select:{
                    name:true
                  }
                }
              }
            },
            user:{
              select:{
                id:true,
                username:true,
                image:true,
              }
            }
          }
        });
        return {
          count:count,
          tracks:tracks
        }
    }),
})