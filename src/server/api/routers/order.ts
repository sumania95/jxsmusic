import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
export const StatusEnum = z.enum(["ALL", "PAID", "PENDING", "EXPIRED", "FAILED", "CANCELLED"])

export const orderRouter = createTRPCRouter({
  // cost: protectedProcedure
  // .input(
  //     z.object({
  //       editor: z.boolean(),
  //   }))
  //   .query(async({ ctx,input }) => {
  //     const sales = await ctx.db.orderPurchase.aggregate({
  //       where:{
  //         order: { status: "PAID" },
  //         track:{
  //           userId:ctx.session.user.id
  //         }
  //       },
  //       _sum:{
  //         finalPrice:true
  //       }
  //     })
  //     const paid = await ctx.db.withdraw.aggregate({
  //       where:{
  //         status: "PAID",
  //         userId:ctx.session.user.id
  //       },
  //       _sum:{
  //         amount:true
  //       }
  //     })
  //     const pending = await ctx.db.withdraw.aggregate({
  //       where:{
  //         status: "PENDING",
  //         userId:ctx.session.user.id
  //       },
  //       _count:{
  //         id:true
  //       },
  //       _sum:{
  //         amount:true
  //       }
  //     })
  //     return {
  //       sales:sales,
  //       paid:paid,
  //       pending:pending,
  //     }
  //   }),
  salesLog: protectedProcedure
  .input(
      z.object({
        editor: z.boolean(),
        take: z.number().max(100),
        skip: z.number(),
    }))
    .query(async({ ctx,input }) => {
      const counter = await ctx.db.orderPurchase.aggregate({
        where:{
          order: { status: "PAID" },
          track:{
            userId:ctx.session.user.id
          }
        },
        _count:{
          id:true
        }
      })
      const sales = await ctx.db.orderPurchase.findMany({
        where:{
          order: { status: "PAID" },
          track:{
            userId:ctx.session.user.id
          }
        },
        select:{
          track:{
            select:{
              title:true,
              is_explicit:true,
              artist:true
            }
          },
          price:true,
          priceDiscount:true,
          finalPrice:true,
          order:{
            select:{
              referenceId:true,
              status:true,
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


  getAll: protectedProcedure
    .input(
      z.object({
        search: z.string().nullish(),
        take: z.number().max(100),
        skip: z.number(),
        sort: z.string().default("desc"),
        status: StatusEnum.default("ALL"), // ✅ use exported enum variable
    }))
    .query(async({ ctx,input }) => {
      const visibleStatuses = ["PAID", "PENDING","FAILED"];
      const filter = {
        // ...input.status==="ALL"?{}:{
        //   status:input.status
        // },
        // ✅ Always hide EXPIRED
        status: {
          in:
            input.status === "ALL"
              ? visibleStatuses
              : [input.status],
        },
        userId:ctx.session.user.id,
        ...input.search?{
          orderPurchase:{
            some:{
              track:{
                keywords:{
                  contains:input.search
                }
              },
              album:{
                trackAlbum:{
                  some:{
                    track:{
                      keywords:{
                        contains:input.search
                      }
                    },
                  }
                }
              }
            },
          }

        }:{},
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
            couponId:true,
            discountType:true,
            discountValue:true,
            discountAmount:true,
            finalAmount:true,
            status:true,
            failedReason:true,
            checkoutUrl:true,
            checkoutId:true,
            expiredAt:true,
            createdAt:true,
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
                    },
                    album:{
                      select:{
                        name:true,
                        trackAlbum:{
                          select:{
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
                            },
                          }
                        }
                      }
                    }
                }
            }
          }
        });

        return {
          count:count,
          orders:orders
        }
    }),

    getAllAdmin: protectedProcedure
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
        ...input.search?{
          orderPurchase:{
            some:{
              track:{
                keywords:{
                  contains:input.search
                }
              },
              album:{
                trackAlbum:{
                  some:{
                    track:{
                      keywords:{
                        contains:input.search
                      }
                    },
                  }
                }
              }
            },
          }

        }:{},
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
            couponId:true,
            discountType:true,
            discountValue:true,
            discountAmount:true,
            finalAmount:true,
            status:true,
            failedReason:true,
            checkoutUrl:true,
            checkoutId:true,
            expiredAt:true,
            createdAt:true,
            user:{
              select:{
                id:true,
                name:true,
                email:true,
                image:true,
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
                    },
                    album:{
                      select:{
                        name:true,
                        trackAlbum:{
                          select:{
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
                            },
                          }
                        }
                      }
                    }
                }
            }
          }
        });

        return {
          count:count,
          orders:orders
        }
    }),
})