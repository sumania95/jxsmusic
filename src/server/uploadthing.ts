import type { NextApiRequest, NextApiResponse } from "next";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { UploadThingError } from "uploadthing/server";
import { getServerAuthSession } from "@/server/auth";


const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req, res }) => {
      // Use NextAuth session
      const session = await getServerAuthSession(req, res);

    if (!session?.user?.is_uploader || !session.user.is_admin)
        throw new Error("Unauthorized"); // ✅ ESLint happy


      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      // You can also save file info to your database here
      // e.g., prisma.user.update({ where: { id: metadata.userId }, data: { image: file.ufsKey } })

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
