import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

import slugify from 'slugify'

export const genreRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ 
      name: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await ctx.db.genre.create({
        data: {
          name: input.name,
          slug:slugify(input.name,{lower: true}),
        },
      });
    }),
  getId: publicProcedure
  .input(z.object({ 
    slug: z.string(),
  }))
  .query(async ({ ctx, input }) => {
    console.log(input.slug)
    const genre =  await ctx.db.genre.findUnique({
      where:{
        slug:input.slug
      },
      select:{
        id:true,
        name:true,
        
      }
    });
    console.log(genre)
    return genre
  }),
   delete: publicProcedure
    .input(z.object({ 
      id: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await ctx.db.genre.delete({
        where: {
          id:input.id,
        },
      });
    }),
  getAll: publicProcedure
    .query(async({ ctx }) => {
      return await ctx.db.genre.findMany({
        select:{
            id:true,
            name:true,
            slug:true,
        },
        orderBy:{
          name:'asc'
        }
      })
    }),
    getAllMain: publicProcedure
    .input(z.object({
      search:z.string().nullish(), 
      sort:z.string().default("asc"), 
      take: z.number().max(100),
      skip: z.number(),
    }))
    .query(async({ ctx,input }) => {
      const filter = {
        name:{
          contains:String(input.search)
        },
      }
      const count = await ctx.db.genre.aggregate({
        where:filter,
        _count: {
          id: true,
        },
      })
      const genres = await ctx.db.genre.findMany({
          take:input.take,
          skip:input.skip,
          orderBy: [{ 
            name: input.sort === "desc" ? "desc" : "asc",
          },],
          where: filter,
          select:{
            id:true,
            name:true,
            slug:true,
            // _count: {
            //   select: {
            //     genre_track: true,
            //   },
            // },
          }
        });

        return {
          count:count,
          genres:genres
        }
    }),

    getAllFeatured: publicProcedure
    .query(async({ ctx }) => {
      return await ctx.db.genre.findMany({
        where:{
          is_featured:true
        },
        select:{
            id:true,
            name:true,
        },
        orderBy:{
          name:'asc'
        }
      })
    }),
});
