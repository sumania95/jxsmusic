import { TRPCError } from "@trpc/server";
import { addMonths } from "date-fns";
import { z } from "zod";
import bcrypt from "bcrypt";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { Resend } from "resend";
import { env } from "@/env";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
        email: z.string(),
        name: z.string(),
        password: z.string(), 
    }))
    .mutation(async({input,ctx}) =>{
        const { email, password, name } = input;
        const exists = await ctx.db.user.findUnique({
            where: { email },
        });
        if (exists) {
            throw new TRPCError({
                code: "CONFLICT",
                message: "Email address already exists.",
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await ctx.db.user.create({
            data:{
                name, 
                email,
                password:hashedPassword,
                expireAt:addMonths(new Date(), -1)
            }
        })
        return {
            email,
            password
        }
    }),
    changepasswordUpdate: protectedProcedure
    .input(z.object({ 
        password: z.string(), 
        newpassword: z.string(),
        newpasswordConfirmation: z.string(),
    }))
    .mutation(async({ input,ctx }) => {
        const { 
            password,
            newpassword,
            newpasswordConfirmation,
        } = input;
        const user = await ctx.db.user.findUnique({
            where: { 
                email:String(ctx?.session?.user?.email),
            },
        });
        console.log(input)
        const invalidPassword = await bcrypt.compare(password,String(user?.password),);
        if (!invalidPassword) {
            throw new Error(`Invalid Current Password`)
        }
        if (newpassword!==newpasswordConfirmation){
            throw new Error(`New passwords do not match.`)
        }
        const hashedPassword = await bcrypt.hash(newpassword,10);
        return await ctx.db.user.update({
            where:{
                email:String(ctx?.session?.user?.email)
            },
            data:{
                password:hashedPassword,
            }
        })
    }),
    resetPassword: publicProcedure
    .input(z.object({ 
        email: z.string(), 
        newpassword: z.string(),
    }))
    .mutation(async({ input,ctx }) => {
        const { 
            email,
            newpassword,
        } = input;
        const hashedPassword = await bcrypt.hash(newpassword,10);
        return await ctx.db.user.update({
            where: { 
                email:email,
            },
            data:{
              password:hashedPassword
            }
        });
    }),
    profileUpdate: protectedProcedure
    .input(z.object({
        name: z.string(),
    }))
    .mutation(async({input,ctx}) =>{
        const {name} = input;
        return await ctx.db.user.update({
          data:{
              name,
          },
          where:{
              email:String(ctx?.session?.user?.email)
          }
        })
    }),
    cancelSubscription: protectedProcedure
    .input(z.object({
        id: z.string(), 
    }))
    .mutation(async({input,ctx}) =>{
        const { id } = input;
        return await ctx.db.user.update({
            where:{
                id:id
            },
            data:{
                expireAt:addMonths(new Date(), -1)
            }
        })
    }),
    getUserRole: protectedProcedure
    .query(async({ctx}) =>{
        return await ctx.db.user.findUnique({
            where:{
                id:ctx.session.user.id
            },
            select:{
                is_admin:true,
                is_uploader:true,
                is_superadmin:true,
                is_video_uploader:true
            }
        })
    }),

    getAll: protectedProcedure
    .input(
        z.object({
        search: z.string().nullish(),
        take: z.number().max(100),
        skip: z.number(),
        filter: z.enum(['all', 'is_uploader']).default('all'),
        sort: z
            .enum([
            'all',
            'username_asc',
            'username_desc',
            'createdAt_asc',
            'createdAt_desc',
            ])
            .default('all'),
        })
    )
    .query(async ({ input, ctx }) => {
        /* ----------------------------- WHERE ----------------------------- */
        const whereUser = {
        ...(input.search && {
            OR: [
            { email: { contains: input.search } },
            { name: { contains: input.search } },
            { username: { contains: input.search } },
            ],
        }),
        ...(input.filter === 'is_uploader' && {
            is_uploader: true,
        }),
        }

        /* --------------------------- ORDER BY ---------------------------- */
        const orderBy =
        input.sort === 'username_asc'
            ? [{ username: 'asc' as const }]
            : input.sort === 'username_desc'
            ? [{ username: 'desc' as const }]
            : input.sort === 'createdAt_asc'
            ? [{ createdAt: 'asc' as const }]
            : input.sort === 'createdAt_desc'
            ? [{ createdAt: 'desc' as const }]
            : [
                // ✅ default "all"
                { username: 'asc' as const },
                { name: 'asc' as const },
            ]

        /* ----------------------------- QUERY ----------------------------- */
        const [users, total] = await Promise.all([
        ctx.db.user.findMany({
            take: input.take,
            skip: input.skip,
            where: whereUser,
            orderBy,
            select: {
            id: true,
            email: true,
            name: true,
            image: true,
            username: true,
            is_uploader: true,
            is_disabled:true,
            credit:true,
            createdAt: true,

            _count: {
                select: {
                track: true,
                },
            },

            track: {
                select: {
                is_published: true,
                },
            },
            },
        }),

        ctx.db.user.count({
            where: whereUser,
        }),
        ])

        /* ------------------------ FORMAT COUNTS -------------------------- */
        const formattedUsers = users.map((u) => {
        const published = u.track.filter(t => t.is_published).length
        const unpublished = u.track.length - published

        return {
            id: u.id,
            email: u.email,
            name: u.name,
            image: u.image,
            username: u.username,
            credit:u.credit,
            is_uploader: u.is_uploader,
            is_disabled: u.is_disabled,
            createdAt: u.createdAt,
            totalTracks: u._count.track,
            publishedTracks: published,
            unpublishedTracks: unpublished,
        }
        })

        return {
            users: formattedUsers,
            total,
        }
    }),


    getAllRequest: protectedProcedure
    .input(z.object({
        search:z.string().nullish(), 
        take: z.number().max(100),
        skip: z.number(),
      }))
    .query(async({ input,ctx }) => {
        const filter = {
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
            ],
            isRequestEditor:true,
            is_uploader:false,
        }
        const count = await ctx.db.user.aggregate({
            where:filter,
            _count: {
              id: true,
            },
          })
        const user =  await ctx.db.user.findMany({
            take:input.take,
            skip:input.skip,
            where:filter,
            select:{
                id:true,
                email:true,
                name:true,
                username:true,
                linkToListen:true,
                expireAt:true,
            },
            orderBy:{
                updatedAt:'desc'
            }
        })
        return {
            user:user,
            count:count
        }
    }),


    userRenew: protectedProcedure
    .input(z.object({ 
        id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
        const { id} = input
        //    
        const customer = await ctx.db.user.findUnique({
            where:{
                id
            }
        })
        let newDate:Date;
        if (new Date(String(customer?.expireAt))<=new Date()){
            newDate = addMonths(new Date(), 1);
        }else{
            newDate = addMonths(String(customer?.expireAt), 1);
        }

        const resend = new Resend(env.NEXT_RESEND_API);
        await resend.emails.send({
            from: 'SMASH BANGERZ <no-reply@smashbangerz.com>',
            to: String(customer?.email),
            subject: `Great News! Your Account Is Active for Another Month`,
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset=utf-8>
                <meta http-equiv=x-ua-compatible content="ie=edge">
                <title>Great News! Your Account Is Active for Another Month</title>
                <meta name=viewport content="width=device-width,initial-scale=1">
                <style>@media screen{@font-face{font-family:'Source Sans Pro';font-style:normal;font-weight:400;src:local('Source Sans Pro Regular'),local('SourceSansPro-Regular'),url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff')}@font-face{font-family:'Source Sans Pro';font-style:normal;font-weight:700;src:local('Source Sans Pro Bold'),local('SourceSansPro-Bold'),url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff')}}a,body,table,td{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}table,td{mso-table-rspace:0pt;mso-table-lspace:0pt}img{-ms-interpolation-mode:bicubic}a[x-apple-data-detectors]{font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;line-height:inherit!important;color:inherit!important;text-decoration:none!important}div[style*="margin: 16px 0;"]{margin:0!important}body{width:100%!important;height:100%!important;padding:0!important;margin:0!important}table{border-collapse:collapse!important}a{color:#1a82e2}img{height:auto;line-height:100%;text-decoration:none;border:0;outline:0}</style>
            </head>
            <body style="background-color:#e9ecef; height: auto;width=600px;">
                <div style="padding-left: 20px;padding-bottom: 20px;">
                    <div style="display:flex; justify-items: center; align-items: center; width=600px; ">
                        <h3 style="font-size: 20px;">Hi ${String(customer?.name)},</h3>
                    </div>
                    <div style="display:flex; justify-items: center; align-items: center; width=600px; ">
                        <p style="font-size: 15px;">Thank you for subscribing! Your 1-month subscription has been successfully added. We hope you enjoy the benefits.</p>
                    </div>
                    <div style="display:flex; justify-items: center; align-items: center; width=600px; ">
                        <p style="font-size: 15px;">If you have any questions, feel free to reach out.</p>
                    </div>
                    <div style="display:flex; justify-items: center; align-items: center; width=600px; ">
                        <p style="font-size: 15px;">SMASH BANGERZ.</p>
                    </div>
                </div>
            </body>
            </html>`
        });
        return await ctx.db.user.update({
            where: {
                id,
            },
            data: {
                expireAt: newDate,
            },
        })
        
    }),

    setCredit: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        credit: z.number().int().min(0).max(1_000_000),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const operator = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          is_admin: true,
          is_superadmin: true,
        },
      });

      if (!operator?.is_admin && !operator?.is_superadmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Administrator access required.",
        });
      }

      const target = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          id: true,
          is_superadmin: true,
        },
      });

      if (!target) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found.",
        });
      }

      if (target.is_superadmin && !operator.is_superadmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only a superadmin can modify a superadmin.",
        });
      }

      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          credit: input.credit,
        },
        select: {
          id: true,
          credit: true,
        },
      });
    }),

  addCredit: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        amount: z.number().int().min(1).max(1_000_000),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const operator = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          is_admin: true,
          is_superadmin: true,
        },
      });

      if (!operator?.is_admin && !operator?.is_superadmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Administrator access required.",
        });
      }

      const target = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          id: true,
          is_superadmin: true,
        },
      });

      if (!target) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found.",
        });
      }

      if (target.is_superadmin && !operator.is_superadmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only a superadmin can modify a superadmin.",
        });
      }

      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          credit: {
            increment: input.amount,
          },
        },
        select: {
          id: true,
          credit: true,
        },
      });
    }),

  setDisabled: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        disabled: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot disable your own account.",
        });
      }

      const operator = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          is_admin: true,
          is_superadmin: true,
        },
      });

      if (!operator?.is_admin && !operator?.is_superadmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Administrator access required.",
        });
      }

      const target = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          id: true,
          is_superadmin: true,
        },
      });

      if (!target) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found.",
        });
      }

      if (target.is_superadmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "A superadmin cannot be disabled.",
        });
      }

      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          is_disabled: input.disabled,
        },
        select: {
          id: true,
          is_disabled: true,
        },
      });
    }),
    
});
