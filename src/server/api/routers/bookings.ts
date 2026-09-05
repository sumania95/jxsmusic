import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const bookingsRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({
    name: z.string().min(2), email: z.string().email(), phone: z.string().min(5), eventDate: z.date(),
    eventLocation: z.string().min(3), eventType: z.string().min(2), expectedGuests: z.number().int().positive(),
    service: z.enum(["Audio DJ", "Video DJ", "DJ + Percussionist", "Others"]), message: z.string().max(2000).optional(),
    selectedDj: z.enum(["DJ Jeff92", "Ayan Sumania", "Jeff92 and Ayan Sumania"]),
  })).mutation(({ ctx, input }) => ctx.db.booking.create({ data: { ...input, userId: ctx.session.user.id } })),
  adminList: protectedProcedure.query(async ({ ctx }) => {
    const u = await ctx.db.user.findUnique({ where: { id: ctx.session.user.id }, select: { is_admin: true, is_superadmin: true } });
    if (!u?.is_admin && !u?.is_superadmin) throw new TRPCError({ code: "FORBIDDEN" });
    return ctx.db.booking.findMany({ orderBy: { createdAt: "desc" } });
  }),
});
