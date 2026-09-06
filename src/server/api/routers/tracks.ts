import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "@/env.js";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";
import { TRPCError } from "@trpc/server";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { buildContentDisposition, formatTrackTitle } from "@/lib/utils";
import sharp from "sharp";
import NodeID3 from "node-id3";
//   await new Promise((resolve) => setTimeout(resolve, 1000));
import path from "path";
import fs from "fs";
import { z } from "zod";
import contentDisposition from "content-disposition";

interface Metadata {
  data:{
    metadata?:{
      file_duration?: number;
      title?: string;
      artist?: string;
      genre?: string;
      comment?: string;
      key?: string;
      bpm?: number;
      year?: number;
    }
  }
}
const Initial =  "https://d2v08wdwrbjeru.cloudfront.net"

const MAX_ARTWORK_SIZE = 300 * 1024; // 300 KB

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

function convertToCamelot(inputKey?: string | null): string {
  if (!inputKey) return "";

  const raw = inputKey.trim();
  const text = raw.toUpperCase();

  // 1️⃣ Already Camelot
  if (/^(1[0-2]|[1-9])[AB]$/.test(text)) {
    return text;
  }

  // 2️⃣ Minor detection (safe)
  const isMinor =
    /minor/i.test(raw) ||
    /(^|\s|#|b)m$/.test(raw.toLowerCase()) ||
    raw.endsWith("-");

  // 3️⃣ Extract note
  const note = text
    .replace(/MINOR|MAJOR|M|-|\s/g, "")
    .replace("FLAT", "B");

  const map: Record<string, { major: string; minor: string }> = {
    C: { major: "8B", minor: "5A" },
    "C#": { major: "3B", minor: "12A" },
    DB: { major: "3B", minor: "12A" },
    D: { major: "10B", minor: "7A" },
    "D#": { major: "5B", minor: "2A" },
    EB: { major: "5B", minor: "2A" },
    E: { major: "12B", minor: "9A" },
    F: { major: "7B", minor: "4A" },
    "F#": { major: "2B", minor: "11A" },
    GB: { major: "2B", minor: "11A" },
    G: { major: "9B", minor: "6A" },
    "G#": { major: "6B", minor: "1A" },
    AB: { major: "6B", minor: "1A" },
    A: { major: "11B", minor: "8A" },
    "A#": { major: "4B", minor: "3A" },
    BB: { major: "4B", minor: "3A" },
    B: { major: "1B", minor: "10A" },
  };

  const entry = map[note];
  if (!entry) return "";

  return isMinor ? entry.minor : entry.major;
}



const DAILY_LIMIT = 500;

function getStartOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getEndOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}



export const trackRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
        bucketName:z.string(), 
        key: z.string(),
        size: z.number(),
        fileType: z.string(),
        fileName: z.string(),
        id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
        // simulate a slow db call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const { s3 } = ctx
        const {key,fileName,size} = input
        const s3Configuration = new S3Client(s3);
        console.log("starting")
        const urlS3 = `${Initial}/${key}`
        try {
          const data:Metadata = await axios.post(`${env.MEDIA_CUTTER_URL}/api/cutter/new-pool-get-info-reximer-with-key`,{
            data:{
                url_s3: String(urlS3),
            }
          })
          console.log(input.fileName)
          const initialIsExplicit = input.fileName.includes("[DIRTY]")
          ? true
          : input.fileName.includes("[CLEAN]")
          ? false
          : false; // fallback to existing field
          const genreMap = await ctx.db.genre.findMany({
            where:{
              name:{
                in:data.data.metadata?.genre?.split(' - ')
              }
            },
            select:{
              id:true
            }
          })
          const genre = genreMap.map((as)=>({
            genreId:as.id
          }))
          const tagMap = await ctx.db.tag.findMany({
            where:{
              name:{
                in:data.data.metadata?.comment?.split(' ')
              }
            },
            select:{
              id:true
            }
          })
          const tag = tagMap.map((as)=>({
            tagId:as.id
          }))
          const title = data.data.metadata?.title?.trim()?data.data.metadata?.title?.trim(): fileName.replace(/\.[^/.]+$/, "").trim();
          const artist = data.data.metadata?.artist?.trim();
          return await ctx.db.track.create({
              data:{
                  title,
                  artist,
                  description:String(data.data.metadata?.genre),
                  in_key:convertToCamelot(String(data.data.metadata?.key)),
                  is_explicit:initialIsExplicit,
                  bpm_start:Number(data.data.metadata?.bpm),
                  bpm_end:Number(data.data.metadata?.bpm),
                  release_year:Number(data.data.metadata?.year??new Date().getFullYear()),
                  filename:fileName,
                  // ✅ RELATION FIX
                  genre_track: genre.length
                  ? {
                      createMany: {
                        data: genre,
                        skipDuplicates: true,
                      },
                    }
                  : undefined,
                  tag_track: tag.length
                  ? {
                      createMany: {
                        data: tag,
                        skipDuplicates: true,
                      },
                    }
                  : undefined,
                  filetype:input.fileType,
                  download_key:key,
                  size:size,
                  duration:Number(data.data.metadata?.file_duration),
                  releaseAt:new Date(),
                  userId:ctx.session.user.id
              },
              select: {
                id: true,
                download_key: true,
                title: true,
                artist: true,
                filename: true,
                description: true,
                duration: true,
                bpm_start: true,
                bpm_end: true,
                in_key: true,
                releaseAt: true,
              },
          })
        } catch (error) {
          console.log(error)
          const params = {
            Bucket: input.bucketName,
            Key: input.key,
          };
        
          try {
            await s3Configuration.send(new DeleteObjectCommand(params));
          } catch (error) {
            console.log(`Error deleting ${input.key} from ${input.bucketName}`, error);
          }
          
          if (error instanceof PrismaClientKnownRequestError) {
            switch (error.code) {
              case 'P2002':
                console.log('Duplicate track already exists.', error.message);
                throw new TRPCError({ 
                  code: 'CONFLICT', 
                  message: JSON.stringify({ id: input.id, originalError: error.message }),
                });

              default:
                console.log('A known request error occurred:', error.message);
                throw new TRPCError({ 
                  code: 'BAD_REQUEST', 
                  message: JSON.stringify({ id: input.id, originalError: error.message }),
                });
            }
          }

          console.log('An unknown error occurred:', error);
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: JSON.stringify({ id: input.id, originalError: (error as Error).message }),
          });


          
        }
        
        
    }),
    delete: protectedProcedure
    .input(z.object({
      id:z.string(),
      key:z.string(),
      bucketName:z.string(),
      exist:z.boolean()

    }))
    .mutation(async({ ctx , input }) => {
        const s3Configuration = new S3Client(ctx.s3);
        if(input.exist){
          const params = {
            Bucket: input.bucketName,
            Key: input.key,
          };
        
          try {
            await s3Configuration.send(new DeleteObjectCommand(params));
          } catch (error) {
            console.log(`Error deleting ${input.key} from ${input.bucketName}`, error);
          }

        }
        return await ctx.db.track.delete({
          where: { 
            id: input.id
          },
        });
    }),

    deleteAdmin: protectedProcedure
    .input(z.object({
      id:z.string(),
    }))
    .mutation(async({ ctx , input }) => {
        const s3Configuration = new S3Client(ctx.s3);
        const track = await ctx.db.track.findUnique({
          where:{
            id:input.id
          }
        })
        const bucketName = `jxs-music`
        const params = {
            Bucket: bucketName,
            Key: String(track?.download_key),
        };
        const paramsPreview = {
            Bucket: bucketName,
            Key: String(track?.preview_key),
        };
        
        try {
          await s3Configuration.send(new DeleteObjectCommand(params));
          console.log('deleted initital')
        } catch (error) {
          console.log(`Error deleting ${String(track?.download_key)} from ${bucketName}`, error);
        }
        try {
          await s3Configuration.send(new DeleteObjectCommand(paramsPreview));
          console.log('deleted preview')

        } catch (error) {
          console.log(`Error deleting ${String(track?.preview_key)} from ${bucketName}`, error);
        }
        return await ctx.db.track.delete({
          where: { 
            id: input.id
          },
        });
    }),
  
    updateReleases: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        artist: z.string(),
        bpm_start: z.number().min(0).max(200),
        bpm_end: z.number().min(0).max(200),
        energy: z.number().min(1).max(10),
        in_key: z.string(),
        release_year: z.number(),
        loopLength: z.number(),
        regionTime: z.object({ start: z.number(), end: z.number() }),
        price: z.number().max(50000),
        is_opm: z.boolean(),
        is_explicit: z.boolean(),
        genre: z.array(z.string()),
        tag: z.array(z.string()),
        download_key: z.string(),
        spotifyTracks: z
          .array(
            z.object({
              name: z.string(),
              artists: z.string(),
              spotifyId: z.string(),
              previewUrl: z.string().optional(),
              spotifyUrl: z.string().optional(),
            })
          )
          .optional(),
        is_published:z.boolean(),
        enabledSnippet:z.boolean(),
        audioBitrate: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const s3Configuration = new S3Client(ctx.s3);
      // CREATE SNIPPIT
      const track = await ctx.db.track.findUnique({
        where:{
          id:input.id
        },
        select: {
          id:true,
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
      })
      if(!track) throw new TRPCError({
        code:"NOT_FOUND",
        message:"Update Track Not Found"
      })
      // 🚫 DAILY UPLOAD LIMIT (10 published tracks per day per user)
      if (input.is_published) {
        const now = new Date();
        const startOfDay = getStartOfDay(now);
        const endOfDay = getEndOfDay(now);

        const todayCount = await ctx.db.track.count({
          where: {
            userId: ctx.session.user.id, // ✅ CORRECT FIELD
            is_published: true,
            releaseAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });

        if (todayCount >= DAILY_LIMIT) {
          const msLeft = endOfDay.getTime() - now.getTime();
          const totalMinutes = Math.ceil(msLeft / 60000);
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;

          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Daily upload limit reached (${DAILY_LIMIT}/day). Try again in ${
              hours > 0 ? `${hours}h ` : ""
            }${minutes}m.`,
          });
        }
      }

      const isVideo = track.filetype?.includes("video")
      const previewExtension = isVideo ? "mp4" : "mp3"
      const previewMime = isVideo ? "video/mp4" : "audio/mpeg"
      const bucketName = `jxs-music`
      const formattedTitle = formatTrackTitle(input.title, input.is_explicit);
      
      const filename =
        `${track.artist} - ${formattedTitle} ` +
        `${track.in_key} ${track.bpm_start}.${previewExtension}`;
      const preview_key = isVideo?`jxs/video/preview/${input.id}.${previewExtension}`:`jxs/preview/${input.id}.${previewExtension}`
      const url = `${Initial}/${track.download_key}`
      console.log('starting api')
      if (input.enabledSnippet) {
        try {
            await axios.post(`${env.MEDIA_CUTTER_URL}/api/cutter/new-pool-reximer-aws`,{
                data:{
                    url_s3: String(url),
                    id: String(input.id),
                    upload_path: preview_key,
                    content_type: previewMime,
                    start: String(input.regionTime.start),
                    end: String(input.regionTime.end),
                    audioBitrate:input.audioBitrate,
                    extension_file: previewExtension,
                    S3_ACCESS_ID:env.S3_ACCESS_ID,
                    S3_SECRET_KEY:env.S3_SECRET_KEY,
                    S3_BUCKET_NAME:bucketName,
                    S3_REGION:"ap-southeast-1"
                }
              })
        } catch (error) {
            console.log(error)
            throw new TRPCError({
              code:"INTERNAL_SERVER_ERROR",
              message:"Snippet File Creation Failed."
            })
            
        }
      }
      // Delete existing genre tracks
      const genreData = input.genre.map((g) => ({ genreId: g }));
      await ctx.db.genreTrack.deleteMany({ where: { trackId: input.id } });
      // Delete existing tag tracks
      const tagData = input.tag.map((g) => ({ tagId: g }));
      await ctx.db.tagTrack.deleteMany({ where: { trackId: input.id } });
      // Delete existing SpotifyTrack links
      await ctx.db.spotifyTrack.deleteMany({ where: { trackId: input.id } });
      const genreDataId = input.genre.map((g) => g);
      const tagDataId = input.tag.map((g) => g);
      const genres = await ctx.db.genre.findMany({
        where: { id: { in: genreDataId } },
        select: { name: true },
      });

      // Fetch tag names
      const tags = await ctx.db.tag.findMany({
        where: { id: { in: tagDataId } },
        select: { name: true },
      });
      // Generate keywords
      const keywords = `${input.artist} - ${formatTrackTitle(input.title,input.is_explicit)} ${input.in_key} ${input.bpm_start}-${input.bpm_end} ${input.artist} ${formatTrackTitle(input.title,input.is_explicit)} ${input.in_key} ${input.bpm_start}-${input.bpm_end} ${input.title} - ${input.artist} ${input.title} ${input.artist}`;
      if (isVideo) {
        const updatedTrack = await ctx.db.track.update({
          where: { id: input.id },
          data: {
            title: input.title,
            artist: input.artist,
            keywords,
            bpm_start: input.bpm_start,
            bpm_end: input.bpm_end,
            energy: input.energy,
            release_year: input.release_year,
            in_key: input.in_key,
            is_opm: input.is_opm,
            is_explicit: input.is_explicit,
            loopLength: input.loopLength,
            regionTime: input.regionTime,
            price: input.price,
            genre_track: {
              createMany: {
                data: genreData,
                skipDuplicates: true,
              },
            },
            tag_track: {
              createMany: {
                data: tagData,
                skipDuplicates: true,
              },
            },
            ...input.is_published?{
              releaseAt:new Date(),
              preview_key: preview_key,
            }:{},
            is_published: true,
            is_reviewed: true,
          },
        });

        // 1. Ensure Spotify exists or create it
        for (const st of input.spotifyTracks ?? []) {
          const spotifyRecord = await ctx.db.spotify.upsert({
            where: { spotifyId: st.spotifyId },
            update: {},
            create: {
              spotifyId: st.spotifyId,
              name: st.name,
              artists: st.artists,
              previewUrl: st.previewUrl,
              spotifyUrl: st.spotifyUrl,
            },
          });

          // 2. Create the relation in SpotifyTrack
          await ctx.db.spotifyTrack.create({
            data: {
              trackId: input.id,
              spotifyId: spotifyRecord.id, // <-- link to the upserted Spotify record
            },
          });
        }
        return updatedTrack;
      }
      const response = await axios.get<ArrayBuffer>(url, {
          responseType: "arraybuffer",
          onDownloadProgress: ({ loaded, total }) => {
            console.log("track",`${input.artist} - ${input.title}`,Math.floor((Number(loaded) * 100) / Number(total)))
          },
        });
      const artwork = await loadAndProcessArtwork(["https://jxsmusic.com/images/track-logo.png","https://jxsmusic.vercel.app/images/track-logo.png","http://localhost:3000/images/track-logo.png"]);
      const updatedTags = {
          title: formattedTitle,
          artist: String(track.artist),
          bpm: String(track.bpm_start),
          initialKey: String(track.in_key),
          year: String(track.release_year),
          album: "JXSMUSIC.COM",
          encodedBy:"JXSMUSIC.COM",
          remixArtist:"Jeff92 & Ayan Sumania",
          genre:genres.length ? genres.map(g => g.name).join(' / ') : 'Others',
          comment: {
            language: "eng",
            text:
              `${input.in_key} - Energy ${input.energy} ${tags.length ? tags.map(t => t.name).join(' ') : '#Others'}`,
          },
          image: artwork
            ? {
                mime: artwork.mime,
                type: {
                  id: 3,
                  name: "front cover",
                },
                description: "Artwork",
                imageBuffer: artwork.buffer,
              }
            : undefined,
        };

      console.log("====begin tagging====");
      const taggedData = NodeID3.write(
        updatedTags,
        Buffer.from(response.data),
      );
      const id =
                globalThis.crypto?.randomUUID?.() ??
                `${Date.now()}-${Math.random()}`
      const newDownloadKey = `jxs/download/${id}.${previewExtension}`
      const upload = async (disposition: string): Promise<void> => {
        await s3Configuration.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: newDownloadKey,
            Body: taggedData,
            ContentType: track.filetype ?? "audio/mpeg",
            ContentDisposition: disposition,
            CacheControl: "public, max-age=63072000, immutable",
          }),
        );
      };
      try {
        await upload(contentDisposition(filename));
      } catch (error) {
        console.warn(
          "Original Content-Disposition failed; using safe fallback",
          error,
        );

        await upload(buildContentDisposition(filename));
      }
      const params = {
          Bucket: bucketName,
          Key: String(track.download_key),
      };
      try {
        await s3Configuration.send(new DeleteObjectCommand(params));
      } catch (error) {
        console.log(`Error deleting ${track.download_key} from ${bucketName}`, error);
      }
      // Update track
      const updatedTrack = await ctx.db.track.update({
        where: { id: input.id },
        data: {
          title: input.title,
          artist: input.artist,
          keywords,
          bpm_start: input.bpm_start,
          bpm_end: input.bpm_end,
          energy: input.energy,
          release_year: input.release_year,
          in_key: input.in_key,
          is_opm: input.is_opm,
          is_explicit: input.is_explicit,
          loopLength: input.loopLength,
          regionTime: input.regionTime,
          price: input.price,
          genre_track: {
            createMany: {
              data: genreData,
              skipDuplicates: true,
            },
          },
          tag_track: {
            createMany: {
              data: tagData,
              skipDuplicates: true,
            },
          },
          ...input.is_published?{
            releaseAt:new Date(),
            preview_key: preview_key,
          }:{},
          download_key:newDownloadKey,
          is_published: true,
          is_reviewed: true,
        },
      });

      // 1. Ensure Spotify exists or create it
      for (const st of input.spotifyTracks ?? []) {
        const spotifyRecord = await ctx.db.spotify.upsert({
          where: { spotifyId: st.spotifyId },
          update: {},
          create: {
            spotifyId: st.spotifyId,
            name: st.name,
            artists: st.artists,
            previewUrl: st.previewUrl,
            spotifyUrl: st.spotifyUrl,
          },
        });

        // 2. Create the relation in SpotifyTrack
        await ctx.db.spotifyTrack.create({
          data: {
            trackId: input.id,
            spotifyId: spotifyRecord.id, // <-- link to the upserted Spotify record
          },
        });
      }

      return updatedTrack;
    }),

    getIdUpdate: protectedProcedure
    .input(z.object({
      id:z.string(), 
    }))
    .query(async({ ctx , input }) => {

        return await ctx.db.track.findUnique({
          where: { 
            id: input.id,
            userId:ctx.session.user.id
          },
          select:{
            id:true,
            title:true,
            artist:true,
            description:true,
            filename:true,
            bpm_start:true,
            bpm_end:true,
            energy:true,
            release_year:true,
            in_key:true,
            is_explicit:true,
            is_opm:true,
            is_exclusive:true,
            download_key:true,
            price:true,
            loopLength:true,
            regionTime:true,
            genre_track:{
              select:{
                genreId:true,
              }
            },
            tag_track:{
              select:{
                tagId:true,
              }
            },
            spotify_track:{
              select:{
                spotify:{
                  select:{
                    id:true,
                    name:true,
                    artists:true,
                    spotifyId:true,
                    spotifyUrl:true,
                    previewUrl:true
                  }
                }
              }
            }
          }
        });
    }),
    getAllUploaded: protectedProcedure
    .input(z.object({
      search:z.string().nullish(), 
      genre:z.array(z.string()),
      key:z.array(z.string()), 
      bpm_start:z.number().min(0).max(200).default(0),
      bpm_end:z.number().min(0).max(200).default(200), 
      take: z.number().max(100),
      skip: z.number(),
    }))
    .query(async({ ctx,input }) => {
      const filter = {
        is_published:false,
        is_reviewed:false,
        is_disabled:false,
        userId:ctx.session.user.id,
        duration:{
          lte:600
        },
      }
      const count = await ctx.db.track.aggregate({
        where:filter,
        _count: {
          id: true,
        },
      })
      const tracks = await ctx.db.track.findMany({
          take:input.take,
          skip:input.skip,
          orderBy: [
            { filename: "asc" },
            { is_explicit: "asc" },
            { releaseAt: "desc" },
            { title: "asc" },
          ],
          where: filter,
          select:{
            id:true,
            download_key:true,
            title:true,
            artist:true,
            in_key:true,
            description:true,
            filename:true,
            duration:true,
            bpm_start:true,
            bpm_end:true,
            releaseAt:true,
          }
        });

        return {
          count:count,
          tracks:tracks
        }
    }),
    getAllReleases: protectedProcedure
    .input(z.object({
      search:z.string().nullish(), 
      genre:z.array(z.string()),
      tag:z.array(z.string()),
      key:z.array(z.string()), 
      bpm_start:z.number().min(0).max(200).default(0),
      bpm_end:z.number().min(0).max(200).default(200), 
      take: z.number().max(100),
      skip: z.number(),
      is_editor:z.boolean(),
      filetypes: z.array(z.string()).optional(),
      explicit: z.enum(["all", "clean", "dirty"]).default("all"),
    }))
    .query(async({ ctx,input }) => {
      const audioTypes = ["audio/mpeg", "audio/mp3"];
      const videoTypes = ["video/mp4", "video/webm", "video/mov"];
      const filetypeFilter =
        input.filetypes?.length === 1
          ? {
              filetype: {
                in:
                  input.filetypes?.[0] === "audio"
                    ? audioTypes
                    : videoTypes,
              },
            }
          : {}
      const searchTerms = (input.search ?? "").trim().split(/\s+/).filter(Boolean);

      const filter = {
        is_published:true,
        is_reviewed:true,
        ...(searchTerms.length ? { AND: searchTerms.map((term) => ({ keywords: { contains: term } })) } : {}),
        ...(input.explicit === "dirty" ? { is_explicit: true } : input.explicit === "clean" ? { is_explicit: false } : {}),
        ...filetypeFilter, // ✅ ADD HERE
        ...input.genre.length>0?{
          genre_track:{
            some:{
              genre:{
                slug:{
                  in:input.genre
                }
              }
            }
          }
        }:{},
        ...input.tag.length>0?{
          tag_track:{
            some:{
              tag:{
                slug:{
                  in:input.tag
                }
              }
            }
          }
        }:{},
        ...input.is_editor?{
          userId:ctx.session.user.id
        }:{},
        ...input.key.length>0?{
          in_key:{
            in:input.key
          }
        }:{},
      }
      const count = await ctx.db.track.aggregate({
        where:filter,
        _count: {
          id: true,
        },
      })
      const tracks = await ctx.db.track.findMany({
          take:input.take,
          skip:input.skip,
          orderBy: [
            { releaseAt: "desc" },
            { title: "asc" },
            { is_explicit: "asc" },
          ],
          where: filter,
          select:{
            id:true,
            title:true,
            artist:true,
            is_opm:true,
            is_explicit:true,
            is_disabled:true,
            is_exclusive:true,
            preview_key:true,
            duration:true,
            releaseAt:true,
            in_key:true,
            energy:true,
            price:true,
            bpm_start:true,
            bpm_end:true,
            filetype:true,
            release_year:true,
            user:{
              select:{
                id:true,
                username:true,
                image:true,
              }
            },
            genre_track:{
              select:{
                genre:{
                  select:{
                    name:true
                  }
                }
              }
            },
            tag_track:{
              select:{
                tag:{
                  select:{
                    name:true
                  }
                }
              }
            },
            _count:{
              select:{
                downloadTrack:true

              }

            }
          }
        });

        return {
          count:count,
          tracks:tracks
        }
    }),
    getAllMainReleases: publicProcedure
    .input(z.object({
      search:z.string().nullish(), 
      genre:z.array(z.string()),
      tag:z.array(z.string()),
      key:z.array(z.string()), 
      bpm_start:z.number().min(0).max(200).default(0),
      bpm_end:z.number().min(0).max(200).default(200), 
      take: z.number().max(100),
      skip: z.number(),
      is_editor:z.boolean(),
      is_editor_id:z.string().nullable(),
      selectionFilter:z.string().nullish(),
      // ✅ NEW
      filetypes: z.array(z.string()).optional(),
      explicit: z.enum(["all", "clean", "dirty"]).default("all"),
    }))
    .query(async({ ctx,input }) => {
      const current_date = new Date()
      current_date.setUTCHours(0, 0, 0, 0);
      const audioTypes = ["audio/mpeg", "audio/mp3"];
      const videoTypes = ["video/mp4", "video/webm", "video/mov"];

      const filetypeFilter =
        input.filetypes?.length === 1
          ? {
              filetype: {
                in:
                  input.filetypes?.[0] === "audio"
                    ? audioTypes
                    : videoTypes,
              },
            }
          : {}
      const searchTerms = (input.search ?? "").trim().split(/\s+/).filter(Boolean);


      const filter = {
        is_published:true,
        is_reviewed:true,
        is_disabled:false,
        // filetype:"audio/mpeg",
        // releaseAt:{
        //   lte:current_date.toISOString()
        // },
        ...filetypeFilter, // ✅ ADD HERE
        ...(searchTerms.length ? { AND: searchTerms.map((term) => ({ keywords: { contains: term } })) } : {}),
        ...(input.explicit === "dirty" ? { is_explicit: true } : input.explicit === "clean" ? { is_explicit: false } : {}),
        ...input.is_editor_id?{
          user:{
            id:input.is_editor_id
          }
        }:{},
        ...input.selectionFilter==="opm"?{
          is_opm:true
        }:{},
        ...input.selectionFilter==="exclusive"?{
          is_exclusive:true
        }:{},
        ...input.genre.length>0?{
          genre_track:{
            some:{
              genre:{
                slug:{
                  in:input.genre
                }
              }
            }
          }
        }:{},
        ...input.tag.length>0?{
          tag_track:{
            some:{
              tag:{
                slug:{
                  in:input.tag
                }
              }
            }
          }
        }:{},
        bpm_start:{
          gte:Number(input.bpm_start),
          lte:Number(input.bpm_end)
        },
        ...input.key.length>0?{
          in_key:{
            in:input.key
          }
        }:{},
      }
      const count = await ctx.db.track.aggregate({
        where:filter,
        _count: {
          id: true,
        },
      })
      const tracks =  await ctx.db.track.findMany({
          take:input.take,
          skip:input.skip,
          orderBy: [
            { releaseAt: "desc" },
            { updatedAt: "desc" },
          ],
          where: filter,
          select:{
            id:true,
            title:true,
            artist:true,
            filetype:true,
            price:true,
            is_explicit:true,
            preview_key:true,
            duration:true,
            releaseAt:true,
            in_key:true,
            energy:true,
            bpm_start:true,
            bpm_end:true,
            release_year:true,
            genre_track:{
              select:{
                genre:{
                  select:{
                    name:true
                  }
                }
              }
            },
            tag_track:{
              select:{
                tag:{
                  select:{
                    name:true
                  }
                }
              }
            },
            user:{
              select:{
                id:true,
                username:true,
                image:true,
              }
            }
          }
        });
        return {
          count:count,
          tracks:tracks
        }
    }),
     getIdMain: publicProcedure
    .input(z.object({
      id:z.string(), 
    }))
    .query(async({ ctx , input }) => {
        return await ctx.db.track.findUnique({
          where: { 
            id: input.id
          },
          select:{
            id:true,
            title:true,
            artist:true,
            price:true,
            is_opm:true,
            is_explicit:true,
            is_exclusive:true,
            preview_count:true,
            duration:true,
            releaseAt:true,
            in_key:true,
            bpm_start:true,
            bpm_end:true,
            release_year:true,
            genre_track:{
              select:{
                genre:{
                  select:{
                    id:true,
                    name:true,
                    slug:true
                  }
                }
              }
            },
            tag_track:{
              select:{
                tag:{
                  select:{
                    id:true,
                    name:true,
                    slug:true
                  }
                }
              }
            },
            user:{
              select:{
                id:true,
                username:true,
                image:true,
              }
            },
            spotify_track:{
              select:{
                spotify:{
                  select:{
                    spotifyId:true,
                    artists:true,
                    name:true,
                    previewUrl:true,
                    spotifyUrl:true
                  }
                }
              }
            }
          }
        });
    }),
})
