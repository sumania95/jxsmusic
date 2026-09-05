import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";


export const webhookRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({
      search:z.string().nullish(), 
      status:z.string().default("asc"), 
      take: z.number().max(100),
      skip: z.number(),
    }))
    .query(async({ ctx,input }) => {
      const filter = {
        ...input.status !=="ALL"?{
            event:input.status
        }:{},
        ...input.search?{order:{
            user:{
                OR:[
                {
                    email:{
                        contains:String(input.search)
                    }
                },
                {
                    name:{
                        contains:String(input.search)
                    }
                }
            ]
            }
        }}:{}
      }
      const count = await ctx.db.webhookLog.aggregate({
        where:filter,
        _count: {
          id: true,
        },
      })
      const webhookLogs = await ctx.db.webhookLog.findMany({
        where:filter,
        take:input.take,
        skip:input.skip,
        include:{
            order:{
                select:{
                    referenceId:true,
                    amount:true,
                    discountAmount:true,
                    finalAmount:true,
                    user:{
                        select:{
                            email:true,
                            name:true
                        }
                    }
                }
            }
          },
          orderBy: [{ 
            receivedAt: "desc",
          },],
        });

        return {
          count:count,
          webhook:webhookLogs
        }
    }),
});
