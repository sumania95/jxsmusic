import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "generated/prisma";

export const cartRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ 
      trackId: z.string().nullable(), 
      albumId: z.string().nullable(), 
      price: z.number(), 
    }).refine(data => data.trackId ?? data.albumId, {
      message: "Either trackId or albumId must be provided."
    }))
    .mutation(async ({ ctx, input }) => {
      const existingPurchase = await ctx.db.cart.findFirst({
      where: {
        userId: ctx.session.user.id,
        trackId: input.trackId,
        albumId: input.albumId,
      },
    });
      if (existingPurchase) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This track has already added.",
        });
      }
      try {
        if(input.trackId){
          return await ctx.db.cart.create({
            data: {
              trackId: input.trackId,
              price:input.price,
              userId: ctx.session.user.id,
            },
          });

        }else{
          return await ctx.db.cart.create({
            data: {
              albumId: input.albumId,
              price:input.price,
              userId: ctx.session.user.id,
              is_album:true
            },
          });
        }
      } catch (error) {
        console.log(error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            // P2002 is the code for a unique constraint violation
            throw new TRPCError({
              code: "CONFLICT",
              message: "This track has already added.",
            });
          } else {
            console.log('A known request error occurred:', error.message);
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `A known request error occurred:', ${error.message}`,
            });
          }
        } else {
          console.log('An unknown error occurred');
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `A known request error occurred`,
          });
        }
      }
      
    }),
  remove: protectedProcedure
    .input(z.object({ 
      id: z.string(), 
    }))
    .mutation(async({ ctx,input }) => {
      return await ctx.db.cart.delete({
        where: { id: input.id },
      });
  }),
  
  counter: protectedProcedure
    .query(async({ ctx }) => {
      const counter =  await ctx.db.cart.aggregate({
        where:{
          userId:ctx.session.user.id,
          status:"cart"
        },
        _count: {
          id: true,
        },
      })
      const totalPrice =  await ctx.db.cart.aggregate({
        where:{
          userId:ctx.session.user.id,
          status:"cart"
        },
        _sum: {
          price: true,
        },
      })
      return {
        counter,
        totalPrice
      }
      
  }),

  checkExistInCart: protectedProcedure
    .input(z.object({ 
      trackId: z.string().nullable(), 
      albumId: z.string().nullable(), 
    }).refine(data => data.trackId ?? data.albumId, {
      message: "Either trackId or albumId must be provided."
    }))
    .query(async({ ctx,input }) => {
      return await ctx.db.cart.findFirst({
        where: {
          userId: ctx.session.user.id,
          trackId: input.trackId,
          albumId: input.albumId,
        },
    });
  }),
  getAll: protectedProcedure
    .query(async({ ctx }) => {
      return await ctx.db.cart.findMany({
        where:{
            status:"cart",
            userId:ctx.session.user.id
        },
        select:{
            id:true,
            track:{
              select:{
                id:true,
                title:true,
                artist:true,
                price:true,
                is_explicit:true,
                user:{
                  select:{
                    image:true,
                  }
                }
              }
            },
            album:{
              select:{
                id:true,
                name:true,
                artist:true,
                image:true,
                price:true,
                user:{
                  select:{
                    image:true,
                  }
                }
              }
            },
        },
        orderBy:{
          createdAt:"asc"
        }
      })
    }),
})