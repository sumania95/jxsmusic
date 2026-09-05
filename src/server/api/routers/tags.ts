import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

import slugify from 'slugify'

export const tagRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ 
      name: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await ctx.db.tag.create({
        data: {
          name: input.name,
          slug:slugify(input.name,{lower: true}),
        },
      });
    }),
  getId: publicProcedure
  .input(z.object({ 
    slug: z.string().min(1),
  }))
  .query(async ({ ctx, input }) => {
    return await ctx.db.tag.findUnique({
      where:{
        slug:input.slug
      },
      select:{
        id:true,
        name:true,
      }
    });
  }),
   delete: publicProcedure
    .input(z.object({ 
      id: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await ctx.db.tag.delete({
        where: {
          id:input.id,
        },
      });
    }),
  getAll: publicProcedure
    .query(async({ ctx }) => {
      return await ctx.db.tag.findMany({
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
      const count = await ctx.db.tag.aggregate({
        where:filter,
        _count: {
          id: true,
        },
      })
      const tags = await ctx.db.tag.findMany({
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
            //     tag_track: true,
            //   },
            // },
            
          }
        });
        return {
          count:count,
          tags:tags
        }
    }),

    getAllFeatured: publicProcedure
    .query(async({ ctx }) => {
      return await ctx.db.tag.findMany({
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
