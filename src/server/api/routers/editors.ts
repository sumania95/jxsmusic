import { env } from "@/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Resend } from "resend";
import z from "zod";

const sortEnum = z.enum([
  "all", // 👈 default
  "username_asc",
  "username_desc",
  "latest_release_asc",
  "latest_release_desc",
])

export const editorRouter = createTRPCRouter({
  // getAll: publicProcedure
  // .input(
  //   z.object({
  //     sort: z.string().default("all"),
  //     search: z.string().nullish(),
  //     take: z.number().max(100),
  //     skip: z.number(),
  //   })
  // )
  // .query(async ({ ctx, input }) => {
  //   /* ----------------------------- WHERE ----------------------------- */
  //   const where = {
  //     is_uploader: true,
  //     ...(input.search
  //       ? {
  //           username: {
  //             contains: input.search,
  //             mode: "insensitive" as const,
  //           },
  //         }
  //       : {}),
  //   }

  //   /* ----------------------------- COUNT ----------------------------- */
  //   const count = await ctx.db.user.count({ where })

  //   /* -------------------------- ORDER BY ----------------------------- */
  //   const orderBy =
  //     input.sort === "username_asc"
  //       ? { username: "asc" as const }
  //       : input.sort === "username_desc"
  //       ? { username: "desc" as const }
  //       : undefined

  //   /* ------------------------------ QUERY ----------------------------- */
  //   const editors = await ctx.db.user.findMany({
  //     where,
  //     orderBy, // username sort only
  //     select: {
  //       id: true,
  //       username: true,
  //       image: true,

  //       track: {
  //         where: { is_published: true },
  //         orderBy: { releaseAt: "desc" as const },
  //         take: 1,
  //         select: {
  //           id: true,
  //           title: true,
  //           releaseAt: true,
  //         },
  //       },

  //       _count: {
  //         select: {
  //           track: {
  //             where: { is_published: true },
  //           },
  //         },
  //       },
  //     },
  //   })

  //   /* --------------------------- JS SORT ------------------------------ */
  //   const sortedEditors = [...editors]

  //   if (
  //     input.sort === "all" ||
  //     input.sort === "latest_release_asc" ||
  //     input.sort === "latest_release_desc"
  //   ) {
  //     sortedEditors.sort((a, b) => {
  //       const aDate = a.track[0]?.releaseAt
  //         ? new Date(a.track[0].releaseAt).getTime()
  //         : 0

  //       const bDate = b.track[0]?.releaseAt
  //         ? new Date(b.track[0].releaseAt).getTime()
  //         : 0

  //       // "all" + latest_release_desc = NEW → OLD
  //       if (
  //         input.sort === "all" ||
  //         input.sort === "latest_release_desc"
  //       ) {
  //         return bDate - aDate
  //       }

  //       // latest_release_asc
  //       return aDate - bDate
  //     })
  //   }

  //   /* --------------------------- PAGINATION --------------------------- */
  //   const paginatedEditors = sortedEditors.slice(
  //     input.skip,
  //     input.skip + input.take
  //   )

  //   return {
  //     editor: paginatedEditors,
  //     count,
  //   }
  // }),
  getAll: publicProcedure
  .input(
    z.object({
      sort: z.string().default("all"),
      search: z.string().nullish(),
      take: z.number().max(100),
      skip: z.number(),
    })
  )
  .query(async ({ ctx, input }) => {
    /* ----------------------------- WHERE ----------------------------- */
    const where = {
      is_uploader: true,

      // ✅ REMOVE editors with 0 published tracks
      track: {
        some: {
          is_published: true,
        },
      },

      ...(input.search
        ? {
            username: {
              contains: input.search
              // mode: "insensitive" as const,
            },
          }
        : {}),
    }

    /* ----------------------------- COUNT ----------------------------- */
    const count = await ctx.db.user.count({ where })

    /* -------------------------- ORDER BY ----------------------------- */
    const orderBy =
      input.sort === "username_asc"
        ? { username: "asc" as const }
        : input.sort === "username_desc"
        ? { username: "desc" as const }
        : undefined

    /* ------------------------------ QUERY ----------------------------- */
    const editors = await ctx.db.user.findMany({
      where,
      orderBy,
      select: {
        id: true,
        username: true,
        image: true,

        track: {
          where: { is_published: true },
          orderBy: { releaseAt: "desc" as const },
          take: 1,
          select: {
            id: true,
            title: true,
            releaseAt: true,
          },
        },

        _count: {
          select: {
            track: {
              where: { is_published: true },
            },
          },
        },
      },
    })

    /* --------------------------- JS SORT ------------------------------ */
    const sortedEditors = [...editors]

    if (
      input.sort === "all" ||
      input.sort === "latest_release_asc" ||
      input.sort === "latest_release_desc"
    ) {
      sortedEditors.sort((a, b) => {
        const aDate = a.track[0]?.releaseAt
          ? new Date(a.track[0].releaseAt).getTime()
          : 0

        const bDate = b.track[0]?.releaseAt
          ? new Date(b.track[0].releaseAt).getTime()
          : 0

        if (
          input.sort === "all" ||
          input.sort === "latest_release_desc"
        ) {
          return bDate - aDate
        }

        return aDate - bDate
      })
    }

    /* --------------------------- PAGINATION --------------------------- */
    const paginatedEditors = sortedEditors.slice(
      input.skip,
      input.skip + input.take
    )

    return {
      editor: paginatedEditors,
      count,
    }
  }),


  getEditor: publicProcedure
   .input(z.object({ 
        id: z.string().min(1),
      }))
    .query(async({ ctx,input }) => {
      return await ctx.db.user.findUnique({
        where:{
            id:input.id,
            is_uploader:true
        },
        select:{
            id:true,
            username:true,
            image:true,
            biography:true,
            is_video_uploader:true,
            link_facebook:true,
            link_instagram:true,
            link_mixclound:true,
            link_soundcloud:true,
            link_spotify:true,
            link_twitch:true,
            link_twitter:true,
            link_youtube:true,
            _count: {
              select: {
                track: true,
              },
            },
            
        },
      })
    }),


///HOME PAGE
    becomeEditor: protectedProcedure
    .input(
      z.object({
        username: z.string().min(3, "DJ Name is required"),
        linkToListen: z.string().max(500, "Max 500 characters"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where:{
          id:ctx.session.user.id
        }
      })
      if(user?.isRequestEditor) {
        throw new TRPCError({
            message:`You have already submitted an editor request. Please wait for review.`,
            code:"CONFLICT"
        })
      }

      return await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          username:input.username,
          linkToListen:input.linkToListen,
          isRequestEditor:true
        },
      });
    }),

    approveEditor: protectedProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({ where: { id: input.userId } });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      if (!user.isRequestEditor) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No pending editor request" });
      }

      // if (user.is_uploader) {
      //   throw new TRPCError({ code: "CONFLICT", message: "User already an editor" });
      // }

      // 1️⃣ Update user role / editor status
      await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          is_uploader: true,
          isRequestEditor: true,
        },
      });

      // 2️⃣ Prepare email variables
      const dashboardUrl = `${env.NEXT_PUBLIC_APP_URL}/restricted/editor/uploader`;
      const platformName = "JEFF92 & AYAN SUMANIA";
      const supportEmail = "no-reply@jxsmusic.com";
      const resend = new Resend(env.RESEND_API);
      const emailHtml = `
        <p>Hi ${user.name},</p>
        <p>Congratulations! 🎉<br/>
        We’re excited to let you know that your application to become an <strong>Editor / Uploader</strong> has been <strong>approved</strong>.</p>

        <p>Welcome to the team! You’re now officially part of our creator community, where DJs and editors share high-quality edits with thousands of users worldwide.</p>

        <h3>🚀 What’s Next?</h3>
        <ul>
          <li>Upload and manage your tracks</li>
          <li>Share your DJ edits with the community</li>
          <li>Earn revenue from your uploads</li>
          <li>Access your Editor Dashboard</li>
        </ul>

        <p>👉 <strong>Log in to your dashboard here:</strong> <a href="${dashboardUrl}" style="color:#7C3AED">${dashboardUrl}</a></p>

        <h3>📌 A Few Reminders</h3>
        <ul>
          <li>Please ensure all uploads follow our quality and content guidelines</li>
          <li>Proper tagging (BPM, Key, Genre, Version) helps your tracks perform better</li>
          <li>If you have questions, our support team is always here to help</li>
        </ul>

        <p>We’re thrilled to have you onboard and can’t wait to hear what you upload.</p>
        <p>Welcome again, and happy editing! 🎶🔥</p>

        <p>Best regards,<br/>
        <strong>${platformName} TEAM</strong></p>
      `;

      // 3️⃣ Send email using Resend
      await resend.emails.send({
        from: `${platformName} <${supportEmail}>`,
        to: user.email!,
        subject: "🎉 Your Editor Application Has Been Approved!",
        html: emailHtml,
      });

      return { success: true, message: "User approved and welcome email sent" };
    }),
})