// src/server/api/routers/contact.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Resend } from "resend";
import { env } from "@/env";

export const contactRouter = createTRPCRouter({
  send: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        message: z.string().min(1),
        subject: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { name, email, message,subject } = input;
      const resend = new Resend(env.NEXT_RESEND_API);
      try {
        await resend.emails.send({
          from: "Jeff92 & Ayan Sumania <no-reply@jeff92ayansumania.com>", // your verified email
          to: "support@cn-dl.com", // developer email to receive contact form
          subject: `Contact Us Form Submission : ${subject}`,
          html: `
            <h2>New Contact Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        });

        return { success: true };
      } catch (err) {
        console.error("Resend email error:", err);
        throw new Error("Failed to send email");
      }
    }),
});
