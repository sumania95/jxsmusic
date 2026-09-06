import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import contentDisposition from "content-disposition";
import axios from "axios";
import NodeID3 from "node-id3";
import { buildContentDisposition, formatTrackTitle } from "@/lib/utils";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { TRPCError } from "@trpc/server";
import { Prisma } from "generated/prisma";

const MAX_ARTWORK_SIZE = 300 * 1024; // 300 KB

const Initial = "https://d2v08wdwrbjeru.cloudfront.net";
// for initial
const Download = "https://d2v08wdwrbjeru.cloudfront.net";
// for download
const Preview = "https://d2v08wdwrbjeru.cloudfront.net";
// for preview
async function loadAndProcessArtwork(
  urls: (string | undefined | null)[],
): Promise<{
  buffer: Buffer;
  mime: "image/jpeg" | "image/png";
} | null> {
  for (const url of urls) {
    if (!url) continue;

    try {
      const inputBuffer = url.startsWith("http")
        ? Buffer.from(
            (
              await axios.get(url, {
                responseType: "arraybuffer",
              })
            ).data,
          )
        : fs.readFileSync(path.resolve(url));

      const pipeline = sharp(inputBuffer).resize(1000, 1000, {
        fit: "cover",
        position: "centre",
      });

      // 🔍 Detect format
      const metadata = await pipeline.metadata();

      let outputBuffer: Buffer;
      let mime: "image/jpeg" | "image/png";

      if (metadata.format === "png") {
        outputBuffer = await pipeline.png({ compressionLevel: 9 }).toBuffer();
        mime = "image/png";
      } else {
        outputBuffer = await pipeline
          .jpeg({ quality: 85, chromaSubsampling: "4:4:4" })
          .toBuffer();
        mime = "image/jpeg";
      }

      // 🔥 Enforce max size
      if (outputBuffer.length > MAX_ARTWORK_SIZE) {
        outputBuffer = await sharp(outputBuffer)
          .jpeg({ quality: 70 })
          .toBuffer();
        mime = "image/jpeg";
      }

      return { buffer: outputBuffer, mime };
    } catch (err) {
      console.warn("Artwork source failed:", url);
    }
  }

  return null;
}

export const signedUrlRouter = createTRPCRouter({
  putObject: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { key, type } = input;
      const s3Configuration = new S3Client(ctx.s3);
      // const date = new Date(input.releaseAt)
      // const year = date.getFullYear();
      // const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11, so add 1
      // const day = date.getDate().toString().padStart(2, '0'); // getDate() returns the day of the month from 1-31
      const bucketName = `jxs-music`;
      // const bucketNamePreview = `jxs-music`
      // const paramsPreview = {
      //     Bucket: bucketNamePreview,
      // };
      // const bucketNameDownload = `jxs-music`
      // const paramsDownload = {
      //     Bucket: bucketNameDownload,
      // };
      const uploadparams = new PutObjectCommand({
        Bucket: bucketName,
        Key: `${key}`,
        ContentType: type,
        CacheControl: "public, max-age=63072000, immutable",
      });
      return {
        url: await getSignedUrl(s3Configuration, uploadparams),
        bucket: bucketName,
        key: key,
      };
      // try {

      // } catch (err) {
      //     console.error(`Error checking if bucket "${bucketName}" exists:`, err);
      //     // //INITIAL CREATE BUCKET
      //     // try {
      //     //     await s3Configuration.send(new CreateBucketCommand(params));
      //     //     console.log('*** INITIAL BUCKET CREATED')

      //     // } catch (err) {
      //     //     console.error(`Error creating bucket "${bucketName}":`, err);
      //     //     // throw err;
      //     // }
      //     // // PREVIEW CREATE BUCKET
      //     // try {
      //     //     await s3Configuration.send(new CreateBucketCommand(paramsPreview));
      //     //     console.log('*** PREVIEW BUCKET CREATED')
      //     // } catch (err) {
      //     //     console.error(`Error creating bucket "${bucketNamePreview}":`, err);
      //     //     // throw err;
      //     // }
      //     // // DOWNLOAD CREATE BUCKET
      //     // try {
      //     //     await s3Configuration.send(new CreateBucketCommand(paramsDownload));
      //     //     console.log('*** DOWNLOAD BUCKET CREATED')

      //     // } catch (err) {
      //     //     console.error(`Error creating bucket "${bucketNameDownload}":`, err);
      //     //     // throw err;
      //     // }
      //     // const uploadparams = new PutObjectCommand({
      //     //     Bucket: bucketName,
      //     //     Key: `${key}`,
      //     //     ContentType:type
      //     // })
      //     // return {
      //     //     url:await getSignedUrl(s3Configuration,uploadparams),
      //     //     bucket:bucketName,
      //     //     key:key
      //     // }
      // }
    }),
  putObjectImage: protectedProcedure
    .input(
      z.object({
        ext: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { ext } = input;
      const id = ctx.session.user.id;
      const key = `profile/${id}_${Date.now()}${ext}`;
      const s3Configuration = new S3Client(ctx.s3);
      const bucketName = `jxs-music`;
      const contentTypeMap: Record<string, string> = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".gif": "image/gif",
      };

      const contentType =
        contentTypeMap[ext.toLowerCase()] ?? "application/octet-stream";
      const uploadparams = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType, // or image/jpeg, image/webp
        CacheControl: "public, max-age=63072000, immutable",
      });
      return {
        url: await getSignedUrl(s3Configuration, uploadparams),
        key: key,
      };
    }),
  testExist: publicProcedure
    .input(
      z.object({
        key: z.string(),
        bucketName: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { key, bucketName } = input;
      // const s3Configuration = new S3Client(ctx.s3);
      // try {
      //     // Check if the object exists
      //     await s3Configuration.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }));
      //     return {
      //         exist:true
      //     }
      // } catch (error) {
      //     console.log(error)
      //     return {
      //         exist:false
      //     }
      // }
      let baseUrl: string | null = null;
      switch (bucketName) {
        case "jxs-music":
          baseUrl = `${Initial}/${key}`;
          break;

        case "jxs-music":
          baseUrl = `${Preview}/${key}.mp3`;
          break;

        case "jxs-music":
          baseUrl = `${Download}/${key}`;
          break;

        default:
          return { exist: false };
      }
      try {
        const res = await fetch(baseUrl, {
          method: "HEAD",
          // prevent cached 403/404 during tests
          cache: "no-store",
        });

        return { exist: res.ok };
      } catch (err) {
        console.error("CloudFront HEAD error:", err);
        return { exist: false };
      }
    }),

  signUrlKeyBucket: publicProcedure
    .input(
      z.object({
        id: z.string(),
        key: z.string(),
        bucketName: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { bucketName, id } = input;
      let baseUrl: string | null = null;
      const track = await ctx.db.track.findUnique({
        where:{
          id:input.id
        },
        select:{
          preview_key:true,
          download_key:true
        }
      })
      switch (bucketName) {
       

        case "pdp-preview":
          await ctx.db.track.updateMany({
            where: {
              id,
              is_published: true,
              is_disabled: false,
            },
            data: {
              preview_count: {
                increment: 1,
              },
            },
          });
          
          baseUrl = `${Initial}/${track?.preview_key}`;

          break;

        case "jxs-music":
          baseUrl = `${Download}/${input.key}`;
          break;

        default:
          return { exist: false };
      }
      return {
        url: baseUrl,
      };
    }),
  downloadObjectOld: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        source: z.enum(["track", "pack"]).default("track"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { s3, session } = ctx;
      const { id } = input;

      console.log(session?.user.email);

      const track = await ctx.db.track.findUnique({
        where: {
          id,
        },
        select: {
          artist: true,
          title: true,
          bpm_start: true,
          bpm_end: true,
          is_explicit: true,
          is_exclusive: true,
          in_key: true,
          release_year: true,
          download_key: true,
          filetype: true,
          user: {
            select: {
              image: true,
            },
          },
          genre_track: {
            select: {
              genre: {
                select: {
                  name: true,
                },
              },
            },
          },
          tag_track: {
            select: {
              tag: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!track) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Track not found",
        });
      }

      if (!track.download_key) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Track download key is missing",
        });
      }

      const purchase = await ctx.db.orderPurchase.findFirst({
        where:
          input.source === "pack"
            ? {
                is_album: true,
                order: { userId: session.user.id, status: "PAID" },
                album: { trackAlbum: { some: { trackId: id } } },
              }
            : {
                order: { userId: session.user.id, status: "PAID" },
                OR: [
                  { trackId: id, is_album: false },
                  {
                    is_album: true,
                    album: { trackAlbum: { some: { trackId: id } } },
                  },
                ],
              },
        select: { id: true },
      });

      if (!purchase) {
        if (input.source === "pack") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "Credits cover individual audio and video edits only. Purchase this pack to download it.",
          });
        }

        const result = await ctx.db.user.updateMany({
          where: {
            id: session.user.id,
            credit: { gt: 0 },
          },
          data: { credit: { decrement: 1 } },
        });

        if (result.count === 0) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "Purchase this edit or buy the $200 / 180-credit pack to download it.",
          });
        }
      }

      // Optional analytics: failure does not stop the download.
      try {
        await ctx.db.track.update({
          where: {
            id,
          },
          data: {
            download_count: {
              increment: 1,
            },
          },
        });
      } catch (error) {
        console.error(
          `Failed to increment download_count for track ${id}`,
          error,
        );
      }

      const formattedTitle = formatTrackTitle(track.title, track.is_explicit);

      const isVideo = track.filetype?.includes("video") ?? false;
      const extension = isVideo ? "mp4" : "mp3";

      const filename =
        `${track.artist} - ${formattedTitle} ` +
        `${track.in_key} ${track.bpm_start}.${extension}`;

      const s3Configuration = new S3Client(s3);

      /*
       * Video download
       *
       * First try the existing contentDisposition().
       * If header construction or signing fails, retry with the safer builder.
       */
      if (isVideo) {
        const createSignedUrl = async (
          disposition: string,
        ): Promise<string> => {
          const command = new GetObjectCommand({
            Bucket: "jxs-music",
            Key: String(track.download_key),
            ResponseContentType: track.filetype ?? "video/mp4",
            ResponseContentDisposition: disposition,
          });

          return getSignedUrl(s3Configuration, command);
        };

        let url: string;

        try {
          url = await createSignedUrl(contentDisposition(filename));
        } catch (error) {
          console.warn(
            "Original Content-Disposition failed; using safe fallback",
            error,
          );

          url = await createSignedUrl(buildContentDisposition(filename));
        }
        return {
          url,
          filename,
        };
      }

      return {
          url: `${Initial}/${track.download_key}`,
          filename,
        };
    }),
    downloadObject: protectedProcedure
  .input(
    z.object({
      id: z.string(),
      source: z.enum(["track", "pack"]).default("track"),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { s3, session } = ctx;
    const { id, source } = input;
    const userId = session.user.id;

    const track = await ctx.db.track.findUnique({
      where: {
        id,
      },
      select: {
        artist: true,
        title: true,
        bpm_start: true,
        bpm_end: true,
        is_explicit: true,
        is_exclusive: true,
        in_key: true,
        release_year: true,
        download_key: true,
        filetype: true,
        user: {
          select: {
            image: true,
          },
        },
        genre_track: {
          select: {
            genre: {
              select: {
                name: true,
              },
            },
          },
        },
        tag_track: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!track) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Track not found",
      });
    }

    if (!track.download_key) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Track download key is missing",
      });
    }

    let acquisitionType: "CART" | "CREDIT";

    try {
      acquisitionType = await ctx.db.$transaction(async (tx) => {
        /*
         * Check existing ownership first.
         *
         * This allows the customer to download the track again without
         * spending another credit or creating another DownloadTrack row.
         */
        const existingDownload = await tx.downloadTrack.findUnique({
          where: {
            userId_trackId: {
              userId,
              trackId: id,
            },
          },
          select: {
            acquisitionType: true,
          },
        });

        if (existingDownload) {
          return existingDownload.acquisitionType;
        }

        /*
         * Check for a paid cart or pack purchase.
         */
        const purchase = await tx.orderPurchase.findFirst({
          where:
            source === "pack"
              ? {
                  is_album: true,
                  order: {
                    userId,
                    status: "PAID",
                  },
                  album: {
                    trackAlbum: {
                      some: {
                        trackId: id,
                      },
                    },
                  },
                }
              : {
                  order: {
                    userId,
                    status: "PAID",
                  },
                  OR: [
                    {
                      trackId: id,
                      is_album: false,
                    },
                    {
                      is_album: true,
                      album: {
                        trackAlbum: {
                          some: {
                            trackId: id,
                          },
                        },
                      },
                    },
                  ],
                },
          select: {
            id: true,
            orderId: true,
          },
        });

        /*
         * A paid cart or album purchase creates a CART entitlement.
         */
        if (purchase) {
          const downloadTrack = await tx.downloadTrack.create({
            data: {
              userId,
              trackId: id,
              acquisitionType: "CART",
              orderId: purchase.orderId,
              creditsSpent: 0,
            },
            select: {
              acquisitionType: true,
            },
          });

          return downloadTrack.acquisitionType;
        }

        /*
         * Credits cannot be used when the request specifically represents
         * a pack download.
         */
        if (source === "pack") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "Credits cover individual audio and video edits only. Purchase this pack to download it.",
          });
        }

        /*
         * No entitlement and no cart purchase, so deduct one credit.
         *
         * The credit deduction and DownloadTrack creation happen in the
         * same transaction.
         */
        const creditResult = await tx.user.updateMany({
          where: {
            id: userId,
            credit: {
              gt: 0,
            },
          },
          data: {
            credit: {
              decrement: 1,
            },
          },
        });

        if (creditResult.count === 0) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "Purchase this edit or buy the $200 / 180-credit pack to download it.",
          });
        }

        const downloadTrack = await tx.downloadTrack.create({
          data: {
            userId,
            trackId: id,
            acquisitionType: "CREDIT",
            orderId: null,
            creditsSpent: 1,
          },
          select: {
            acquisitionType: true,
          },
        });

        return downloadTrack.acquisitionType;
      });
    } catch (error) {
      /*
       * Handle two simultaneous download requests.
       *
       * The unique constraint prevents duplicate DownloadTrack rows.
       * Because creation and credit deduction are in one transaction,
       * the losing transaction rolls back its credit deduction.
       */
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const existingDownload =
          await ctx.db.downloadTrack.findUnique({
            where: {
              userId_trackId: {
                userId,
                trackId: id,
              },
            },
            select: {
              acquisitionType: true,
            },
          });

        if (!existingDownload) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not verify the track acquisition",
            cause: error,
          });
        }

        acquisitionType = existingDownload.acquisitionType;
      } else {
        throw error;
      }
    }

    /*
     * Increment on every download, including repeat downloads.
     * Analytics failure does not block access to the file.
     */
    try {
      await ctx.db.track.update({
        where: {
          id,
        },
        data: {
          download_count: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      console.error(
        `Failed to increment download_count for track ${id}`,
        error,
      );
    }

    const formattedTitle = formatTrackTitle(
      track.title,
      track.is_explicit,
    );

    const isVideo = track.filetype?.includes("video") ?? false;
    const extension = isVideo ? "mp4" : "mp3";

    const filename =
      `${track.artist} - ${formattedTitle} ` +
      `${track.in_key} ${track.bpm_start}.${extension}`;

    const s3Client = new S3Client(s3);

    if (isVideo) {
      const createSignedUrl = async (
        disposition: string,
      ): Promise<string> => {
        const command = new GetObjectCommand({
          Bucket: "jxs-music",
          Key: String(track.download_key),
          ResponseContentType: track.filetype ?? "video/mp4",
          ResponseContentDisposition: disposition,
        });

        return getSignedUrl(s3Client, command);
      };

      let url: string;

      try {
        url = await createSignedUrl(
          contentDisposition(filename),
        );
      } catch (error) {
        console.warn(
          "Original Content-Disposition failed; using safe fallback",
          error,
        );

        url = await createSignedUrl(
          buildContentDisposition(filename),
        );
      }

      return {
        url,
        filename,
        acquisitionType,
      };
    }

    return {
      url: `${Initial}/${track.download_key}`,
      filename,
      acquisitionType,
    };
  }),
  getObject: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { s3 } = ctx;
      const s3Configuration = new S3Client(s3);
      const track = await ctx.db.track.findUnique({
        where: {
          id: input.id,
        },
        select: {
          download_key: true,
        },
      });
      // const getparams = new GetObjectCommand({
      //     Bucket: "jxs-music",
      //     Key: String(track?.download_key),
      //     ResponseContentType:"audio/mpeg",
      // })
      const url = `${Initial}/${String(track?.download_key)}`;
      return url;
    }),
});
