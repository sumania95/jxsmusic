import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
export const StatusEnum = z.enum(["ALL", "PAID", "PENDING", "EXPIRED", "CANCELLED"])

export const salesRouter = createTRPCRouter({
  getAllByTrack: protectedProcedure
  .input(
      z.object({
        take: z.number().max(100),
        skip: z.number(),
    }))
    .query(async({ ctx,input }) => {
      const counter = await ctx.db.orderPurchase.aggregate({
        where:{
          order: { status: "PAID" },
        },
        _count:{
          id:true
        }
      })
      const sales = await ctx.db.orderPurchase.findMany({
        where:{
          order: { status: "PAID" },
        },
        select:{
          track:{
            select:{
              title:true,
              is_explicit:true,
              artist:true
            }
          },
          album:{
            select:{
              id:true,
              name:true,
              artist:true,
            }
          },
          is_album:true,
          price:true,
          priceDiscount:true,
          finalPrice:true,
          order:{
            select:{
              referenceId:true,
              status:true,
              checkoutId:true,
              updatedAt:true
            }
          }
        },
        orderBy:{
          order:{
            updatedAt:"desc"
          }
        },
        take:input.take,
        skip:input.skip
      })
      return {
        sales:sales,
        counter:counter
      }
    }),
  getAllByOrder: protectedProcedure
    .input(
      z.object({
        search: z.string().nullish(),
        take: z.number().max(100),
        skip: z.number(),
        sort: z.string().default("desc"),
        status: StatusEnum.default("ALL"), // ✅ use exported enum variable
    }))
    .query(async({ ctx,input }) => {
      const filter = {
        ...input.status==="ALL"?{}:{
         status:input.status
        },
            orderPurchase:{
              some:{
                track:{
                  keywords:{
                    contains:String(input.search)
                  }
                }
              }
            }
      }
      const count = await ctx.db.order.aggregate({
        where:filter,
        _count: {
          id: true,
        },
      })
      const orders = await ctx.db.order.findMany({
          where:filter,
          take:input.take,
          skip:input.skip,
          orderBy: [
            { createdAt: input.sort === "desc" ? "desc" : "asc", },
          ],
          select:{
            id:true,
            referenceId:true,
            amount:true,
            discountAmount:true,
            finalAmount:true,
            status:true,
            checkoutUrl:true,
            checkoutId:true,
            createdAt:true,
            updatedAt:true,
            user:{
                select:{
                    name:true
                }
            },
            orderPurchase:{
                select:{
                    price:true,
                    track:{
                        select:{
                            id:true,
                            title:true,
                            artist:true,
                            in_key:true,
                            bpm_end:true,
                            bpm_start:true,
                            is_explicit:true,
                        }
                    }
                }
            }
          }
        });
        return {
          counter:count,
          orders:orders
        }
    }),
     getAllContributorSales: protectedProcedure
    .input(
      z.object({
        search: z.string().nullish(),
        take: z.number().max(100),
        skip: z.number(),
        sort: z.string().default("desc"),
        status: StatusEnum.default("ALL"), // ✅ use exported enum variable
    }))
    .query(async({ ctx,input }) => {
        const filter = {
            is_uploader:true
        }
        const count = await ctx.db.user.aggregate({
            where:filter,
            _count: {
            id: true,
            },
        })
        const purchaseTotals = await ctx.db.orderPurchase.groupBy({
            by: ['orderId'],
            _sum: {
                price: true,
                priceDiscount: true,
                finalPrice: true,
            },
        });
        const orders = await ctx.db.order.findMany({
            select: {
                id: true,
                userId: true,
            },
        });


    }),
})