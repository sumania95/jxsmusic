import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db"; // Prisma client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Optional: secret token to prevent public access
  // const token = req.headers["x-cron-token"];
  // if (token !== process.env.CRON_TOKEN) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  try {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const deletedOrders = await db.order.deleteMany({
      where: {
        status: "FAILED",
        createdAt: { lt: twoMonthsAgo },
      },
    });

    console.log(`Deleted ${deletedOrders.count} failed orders older than 2 months.`);
    return res.status(200).json({ deleted: deletedOrders.count });
  } catch (err) {
    console.error("Failed to delete failed orders:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
