import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { s3 } from "@/server/s3";
import type { GetServerSidePropsContext } from "next";

export async function createTRPCSSRContext(context: GetServerSidePropsContext) {
  // Reuse your existing auth middleware
  const session = await auth(context); // session may be null if not logged in

  return {
    req: context.req,
    res: context.res,
    session, // ✅ add session
    db,      // ✅ add Prisma client
    s3,      // ✅ add S3 client/config
  };
}
