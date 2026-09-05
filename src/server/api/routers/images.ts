import { createTRPCRouter, protectedProcedure} from "@/server/api/trpc";
import { z } from "zod";
import { UTApi } from "uploadthing/server";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
const utapi = new UTApi();

const Image = "https://d2v08wdwrbjeru.cloudfront.net" 
    // for preview

export const imageRouter = createTRPCRouter({
  saveImageToUser: protectedProcedure
    .input(z.object({ 
        image: z.string().url(), 
        imageKey: z.string(), 
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      // Get existing user
      const user = await ctx.db.user.findUnique({
        where: { id: userId },
      });
      if(user?.imageKey){
        await utapi.deleteFiles(String(user?.imageKey));
      }
      const updatedUser = await ctx.db.user.update({
        where: { id: userId },
        data: {
            image: input.image,
            imageKey: input.imageKey,
        },
    });

  

    return updatedUser;
  }),
  saveImageAWS: protectedProcedure
    .input(z.object({ 
        imageKey: z.string(), 
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      // Get existing user
      const user = await ctx.db.user.findUnique({
        where: { id: userId },
      });
      
      const s3Configuration = new S3Client(ctx.s3);
      if(user?.imageKey){
        const params = {
          Bucket: "jxs-music",
          Key: user.imageKey,
        };
      
        try {
          await s3Configuration.send(new DeleteObjectCommand(params));
        } catch (error) {
          console.log(`Error deleting ${user.imageKey} from jxs-music`, error);
        }
      }
      const updatedUser = await ctx.db.user.update({
        where: { id: userId },
        data: {
            image: `${Image}/${input.imageKey}`,
            imageKey: input.imageKey,
        },
      });
    return updatedUser;
  }),
});
