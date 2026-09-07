// src/server/trpc/router/dmca.ts
import { env } from "@/env";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { Resend } from "resend";
import { z } from "zod";

export const dmcaRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        companyName: z.string(),
        address: z.string(),
        zipCode: z.string(),
        telephone: z.string(),
        relationship: z.string().min(1),
        contentTitle: z.string().min(1),
        contentUrl: z.string().url(),
        additionalComments: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
        const resend = new Resend(env.RESEND_API);
        await ctx.db.dmcaRequest.create({
            data: input,
        });
        // 2️⃣ Send email notification to developer
        await resend.emails.send({
            from: "Jeff92 & Ayan Sumania <no-reply@jxsmusic.com>",
            to: "support@cn-dl.com",
            subject: `New DMCA Request from ${input.name}`,
            html: `
            <h1>New DMCA Request - JEFF92 & AYAN SUMANIA</h1>
            <p><strong>Name:</strong> ${input.name}</p>
            <p><strong>Email:</strong> ${input.email}</p>
            <p><strong>Company:</strong> ${input.companyName ?? "N/A"}</p>
            <p><strong>Address:</strong> ${input.address ?? "N/A"}</p>
            <p><strong>Zip Code:</strong> ${input.zipCode ?? "N/A"}</p>
            <p><strong>Telephone:</strong> ${input.telephone ?? "N/A"}</p>
            <p><strong>Relationship:</strong> ${input.relationship}</p>
            <p><strong>Content Title:</strong> ${input.contentTitle}</p>
            <p><strong>Content URL:</strong> <a href="${input.contentUrl}">${input.contentUrl}</a></p>
            <p><strong>Additional Comments:</strong> ${input.additionalComments ?? "N/A"}</p>
            <p>Submitted at: ${new Date().toLocaleString()}</p>
            `,
        });

        return { success: true };
    }),

  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.dmcaRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

//   takeAction: protectedProcedure
//     .input(
//       z.object({
//         takedownId: z.string(),
//         status: z.enum(["TAKEN", "REJECTED"]),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//         const resend = new Resend(env.NEXT_RESEND_API);
//       // Update takedown request
//       const takedown = await ctx.db.takeDownRequest.update({
//         where: { id: input.takedownId },
//         data: { status: input.status },
//       });

//       // Fetch track info
//       const track = await ctx.db.track.findUnique({
//         where: { id: takedown.trackId },
//       });

//       if (!track) throw new Error("Track not found");

//       // Disable track if taken down
//       if (input.status === "TAKEN") {
//         await ctx.db.track.update({
//           where: { id: track.id },
//           data: { isDisabled: true },
//         });
//       }

//       // Email to uploader
//       await resend.emails.send({
//         from: "music@jeff92ayansumania.com",
//         to: track.uploaderEmail,
//         subject: `Your track "${track.title}" has been ${input.status.toLowerCase()}`,
//         html: `
//           <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//             <h2 style="color:#E53E3E;">Track Takedown Notification</h2>
//             <p>Dear Uploader,</p>
//             <p>Your track <strong>"${track.title}"</strong> (ID: ${track.id}) has been <strong>${input.status}</strong> due to a copyright complaint.</p>
//             ${input.status === "TAKEN" ? `<p>The track has been disabled and will no longer appear in the catalog.</p>` : ''}
//             <p>If you have any questions, please contact music@jeff92ayansumania.com</p>
//             <p>Thank you,<br/>Jeff92 & Ayan Sumania Team</p>
//           </div>
//         `,
//       });

//       // Email to user who requested takedown
//       await resend.emails.send({
//         from: "music@jeff92ayansumania.com",
//         to: takedown.requestUser,
//         subject: `Takedown Request for "${track.title}" ${input.status.toLowerCase()}`,
//         html: `
//           <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//             <h2 style="color:#3182CE;">Takedown Request Update</h2>
//             <p>Dear User,</p>
//             <p>Your takedown request for the track <strong>"${track.title}"</strong> (ID: ${track.id}) has been <strong>${input.status}</strong>.</p>
//             ${input.status === "TAKEN" ? `<p>The track has been removed from public catalog.</p>` : `<p>No action has been taken on the track.</p>`}
//             <p>Thank you for helping us maintain copyright compliance.</p>
//             <p>Jeff92 & Ayan Sumania Team</p>
//           </div>
//         `,
//       });

//       return takedown;
//     }),
});
