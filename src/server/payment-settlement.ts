import { db } from "@/server/db";

export async function settlePaidOrder(referenceId: string) {
  const order = await db.order.findUnique({
    where: { referenceId },
    include: {
      orderPurchase: {
        include: { album: { include: { trackAlbum: true } } },
      },
    },
  });
  if (!order) throw new Error("Order not found");
  if (order.status === "PAID") return order;

  const now = new Date();
  const trackIds = [
    ...new Set(
      order.orderPurchase.flatMap((purchase) =>
        purchase.is_album
          ? (purchase.album?.trackAlbum.map((entry) => entry.trackId) ?? [])
          : purchase.trackId
            ? [purchase.trackId]
            : [],
      ),
    ),
  ];

  await db.$transaction(async (prisma) => {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID", paidAt: now },
    });

    if (order.purpose === "CREDIT_PACK" && order.userId && order.creditAmount > 0) {
      await prisma.user.update({
        where: { id: order.userId },
        data: { credit: { increment: order.creditAmount } },
      });
    }

    if (trackIds.length) {
      await prisma.track.updateMany({
        where: { id: { in: trackIds } },
        data: { download_count: { increment: 1 } },
      });
    }
  });

  return order;
}
