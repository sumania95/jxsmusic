import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import slugify from 'slugify'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const Preview = "https://d2v08wdwrbjeru.cloudfront.net"
export const albumRouter = createTRPCRouter({

  getCoverUploadUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        filetype: z.string(),
      })
    )
    .mutation(async ({ ctx,input }) => {
      const key = `albums/${crypto.randomUUID()}-${input.filename}`;
      const s3Configuration = new S3Client(ctx.s3);
      const command = new PutObjectCommand({
        Bucket: "jxs-music",
        Key: key,
        ContentType: input.filetype,
        CacheControl: "public, max-age=63072000, immutable"
      });
      const uploadUrl = await getSignedUrl(s3Configuration, command, {
        expiresIn: 60,
      });

      return {
        uploadUrl,
        fileUrl: `${Preview}/${key}`,
        key
      };
    }),

  create: publicProcedure
   .input(z.object({
    name: z.string(),
    artist: z.string().optional(),
    price: z.number(),
    tracks: z.array(z.object({
      trackId: z.string(),
    })),
    image: z.string().nullable(),
    imageKey: z.string().nullable(),
    isActive:z.boolean()
  }))
  .mutation(async ({ input, ctx }) => {
    return ctx.db.album.create({
      data: {
        name: input.name,
        artist: input.artist,
        price: input.price,
        slug:slugify(input.name,{lower: true}),
        userId: String(ctx?.session?.user.id),
        trackAlbum: {
          create: input.tracks.map(t => ({
            trackId: t.trackId,
          })),
        },
        image: input.image ?? "",
        imageKey: input.imageKey ?? "",
        isActive:input.isActive,
      },
    });
  }),

  update: publicProcedure
   .input(z.object({
    id: z.string(),
    name: z.string(),
    artist: z.string().optional(),
    price: z.number(),
    image: z.string().nullable(),
    imageKey: z.string().nullable(),
    isActive:z.boolean()
  }))
  .mutation(async ({ input, ctx }) => {
    // Get existing user
    const album = await ctx.db.album.findUnique({
      where: { id: input.id },
    });
    const s3Configuration = new S3Client(ctx.s3);
    if(input.image && album?.imageKey){
      const params = {
        Bucket: "jxs-music",
        Key: album.imageKey,
      };
    
      try {
        await s3Configuration.send(new DeleteObjectCommand(params));
      } catch (error) {
        console.log(`Error deleting ${album.imageKey} from jxs-music`, error);
      }
    }
    return ctx.db.album.update({
      where:{
        id:input.id,
        userId:ctx.session?.user.id
      },
      data: {
        name: input.name,
        artist: input.artist,
        price: input.price,
        slug:slugify(input.name,{lower: true}),
        ...(input.image && { image: input.image }),
        ...(input.imageKey && { imageKey: input.imageKey }),
        isActive:input.isActive,
      },
    });
  }),
  getIdUpdate: protectedProcedure
  .input(z.object({ 
    id: z.string(),
  }))
  .query(async ({ ctx, input }) => {
    console.log(input.id)
    const album =  await ctx.db.album.findUnique({
      where:{
        id:input.id,
        userId:ctx.session.user.id
      },
      select:{
        id:true,
        name:true,
        artist:true,
        price:true,
        image:true,
        isActive:true,
      }
    });
    return album
  }),
  search: publicProcedure
    .input(z.object({
      q: z.string().min(1),
      limit: z.number().default(20),
      excludeIds: z.array(z.string()).optional(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.track.findMany({
        where: {
          OR: [
            { title: { contains: input.q } },
            { artist: { contains: input.q } },
          ],
          ...input.excludeIds?.length
            ? {
                id: {
                  notIn: input.excludeIds, // 👈 THIS excludes selected tracks
                },
              }
            : {},
          is_published: true,
          userId:ctx.session?.user.id
        },
        select:{
          id:true,
          title:true,
          artist:true,
          is_explicit:true
        },
        take: input.limit,
        orderBy: { title: "asc" },
      });
  }),
  getReleasedTrack: protectedProcedure
    .input(
    z.object({
      search: z.string().nullish(),
      genre: z.array(z.string()),
      tag: z.array(z.string()),
      key: z.array(z.string()),

      bpm_start: z.number().min(0).max(200).default(0),
      bpm_end: z.number().min(0).max(200).default(200),

      take: z.number().max(100),
      skip: z.number(),

      // 👇 OPTIONAL FILTER
      hideAlbumTracks: z.boolean().optional(), // default: show all
    })
  )
  .query(async ({ ctx, input }) => {
    const filter =  {
      is_published: true,
      is_reviewed: true,
      is_disabled: false,

      keywords: {
        contains: input.search ?? undefined,
      },

      // user: {
      //   id: ctx.session.user.id,
      // },

      // 👇 ONLY hide when explicitly enabled
      ...(input.hideAlbumTracks
        ? {
            trackAlbum: {
              none: {},
            },
          }
        : {}),

      ...(input.genre.length > 0
        ? {
            genre_track: {
              some: {
                genre: {
                  slug: {
                    in: input.genre,
                  },
                },
              },
            },
          }
        : {}),

      ...(input.tag.length > 0
        ? {
            tag_track: {
              some: {
                tag: {
                  slug: {
                    in: input.tag,
                  },
                },
              },
            },
          }
        : {}),

      bpm_start: {
        gte: input.bpm_start,
        lte: input.bpm_end,
      },

      ...(input.key.length > 0
        ? {
            in_key: {
              in: input.key,
            },
          }
        : {}),
    }

    const count = await ctx.db.track.aggregate({
      where: filter,
      _count: {
        id: true,
      },
    })

    const tracks = await ctx.db.track.findMany({
      take: input.take,
      skip: input.skip,
      where: filter,
      orderBy: {
        releaseAt: "desc",
      },
      select: {
        id: true,
        title: true,
        artist: true,
        is_explicit: true,
        releaseAt: true,
        in_key: true,
        price: true,
      },
    })

    return {
      count,
      tracks,
    }
  }),
  getId: publicProcedure
  .input(z.object({ 
    slug: z.string(),
  }))
  .query(async ({ ctx, input }) => {
    const album =  await ctx.db.album.findUnique({
      where:{
        slug:input.slug
      },
      select:{
        id:true,
        name:true,
        slug:true,
        artist:true,
        price:true,
        image:true,
        user:{
          select:{
            id:true,
            image:true,
            username:true
          }
        },

      }
    });
    return album
  }),

  getIdFull: publicProcedure
  .input(z.object({ 
    slug: z.string(),
    take: z.number().max(100),
    skip: z.number(),
  }))
  .query(async ({ ctx, input }) => {
    const count = await ctx.db.trackAlbum.aggregate({
      where:{
        album:{
          slug:input.slug
        }
      },
      _count: {
        id: true,
      },
    })
    const album =  await ctx.db.trackAlbum.findMany({
      where:{
        album:{
          slug:input.slug
        }
      },
      orderBy:[
        {
          track:{
            title:"asc"
          }
        },
        {
          track:{
            artist:"asc"
          }
        }
      ],
      take:input.take,
      skip:input.skip,
      select:{
        track:{
          select:{
            id:true,
            title:true,
            artist:true,
            filetype:true,
            is_opm:true,
            is_explicit:true,
            preview_key:true,
            is_exclusive:true,
            duration:true,
            releaseAt:true,
            in_key:true,
            price:true,
            bpm_start:true,
            bpm_end:true,
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
          }
        }
      }
    });
    return {
      album,
      count
    }
  }),

   delete: publicProcedure
    .input(z.object({ 
      id: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await ctx.db.genre.delete({
        where: {
          id:input.id,
        },
      });
    }),
  getAll: protectedProcedure
  .input(z.object({
      search:z.string().nullish(), 
      sort:z.string().default("asc"), 
      take: z.number().max(100),
      skip: z.number(),
    }))
    .query(async({ ctx,input }) => {
      const filter = {
        name:{
          contains:String(input.search)
        },
        userId:ctx.session.user.id
      }
      const count = await ctx.db.album.aggregate({
        where:filter,
        _count: {
          id: true,
        },
      })
      const albums = await ctx.db.album.findMany({
          take:input.take,
          skip:input.skip,
          orderBy: [{ 
            createdAt: input.sort === "desc" ? "desc" : "asc",
          },],
          where: filter,
          select:{
            id:true,
            name:true,
            artist:true,
            isActive:true,
            price:true,
            image:true,
            user:{
              select:{
                image:true,
              }
            },
            trackAlbum:{
              select:{
                track:{
                  select:{
                    id:true,
                    title:true,
                    artist:true,
                    description:true,
                    bpm_start:true,
                    bpm_end:true,
                    release_year:true,
                    in_key:true,
                    is_explicit:true,
                    is_opm:true,
                    is_exclusive:true,
                    price:true,
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
                  }
                }
              }
            }
          }
        });

        return {
          count:count,
          albums:albums
        }
    }),
    getAllMain: publicProcedure
    .input(z.object({
      search:z.string().nullish(),
      genre:z.array(z.string()),
      tag:z.array(z.string()), 
      sort:z.string().default("desc"), 
      take: z.number().max(100),
      skip: z.number(),
    }))
    .query(async({ ctx,input }) => {
      // const filter = {
      //   name:{
      //     contains:String(input.search)
      //   },
      //   trackAlbum:{
      //     some:{
      //       track:{
      //         ...input.genre.length>0?{
      //           genre_track:{
      //             some:{
      //               genre:{
      //                 slug:{
      //                   in:input.genre
      //                 }
      //               }
      //             }
      //           }
      //         }:{},
      //         ...input.tag.length>0?{
      //           tag_track:{
      //             some:{
      //               tag:{
      //                 slug:{
      //                   in:input.tag
      //                 }
      //               }
      //             }
      //           }
      //         }:{},
      //       }
      //     }
      //   },
      //   isActive:true
      // }
      const filter = {
        ...(input.search
        ? {
            OR: [
              { name: { contains: input.search } },
              {
                trackAlbum: {
                  some: {
                    track: {
                      user: {
                        username: { contains: input.search },
                      },
                    },
                  },
                },
              },
            ],
          }
        : {}),
        trackAlbum:{
          some:{
            track:{
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
            }
          }
        },
        isActive:true
      }
      const count = await ctx.db.album.aggregate({
        where:filter,
        _count: {
          id: true,
        },
      })
      const albums = await ctx.db.album.findMany({
          take:input.take,
          skip:input.skip,
          orderBy: [{ 
            createdAt: input.sort === "desc" ? "desc" : "asc",
          },],
          where: filter,
          select:{
            id:true,
            name:true,
            artist:true,
            price:true,
            slug:true,
            image:true,
            user:{
              select:{
                id:true,
                image:true,
              }
            },
            _count:{
              select:{
                trackAlbum:true
              }
            }
          }
        });

        return {
          count:count,
          albums:albums
        }
    }),

    getAllMainHome: publicProcedure
  .input(
    z.object({
      search: z.string().nullish(),
      sort: z.enum(["asc", "desc"]).default("desc"),
      take: z.number().min(1).max(10).default(5),
      cursor: z.string().nullish(), // 👈 IMPORTANT
    })
  )
  .query(async ({ ctx, input }) => {
    const take = input.take + 1

    const filter = {
      isActive: true,
      ...(input.search && {
        name: {
          contains: input.search,
        },
      }),
    }

    const albums = await ctx.db.album.findMany({
      take,
      cursor: input.cursor
        ? { id: input.cursor }
        : undefined,
      orderBy: {
        createdAt: input.sort,
      },
      where: filter,
      select: {
        id: true,
        name: true,
        artist: true,
        price: true,
        slug: true,
        image: true,
        user: {
          select: {
            id: true,
            image: true,
          },
        },
        _count: {
          select: {
            trackAlbum: true,
          },
        },
      },
    })

    let nextCursor: string | undefined = undefined

    if (albums.length > input.take) {
      const nextItem = albums.pop()
      nextCursor = nextItem!.id
    }

    return {
      albums,
      nextCursor,
    }
  }),

    getAllMainEditor: publicProcedure
    .input(z.object({
      search:z.string().nullish(), 
      sort:z.string().default("desc"), 
      take: z.number().max(100),
      skip: z.number(),
      editorId:z.string()
    }))
    .query(async({ ctx,input }) => {
      const filter = {
        name:{
          contains:String(input.search)
        },
        isActive:true,
        user:{
          id:input.editorId
        }
      }
      const count = await ctx.db.album.aggregate({
        where:filter,
        _count: {
          id: true,
        },
      })
      const albums = await ctx.db.album.findMany({
          take:input.take,
          skip:input.skip,
          orderBy: [{ 
            createdAt: input.sort === "desc" ? "desc" : "asc",
          },],
          where: filter,
          select:{
            id:true,
            name:true,
            artist:true,
            price:true,
            slug:true,
            image:true,
            user:{
              select:{
                id:true,
                image:true,
              }
            },
            _count:{
              select:{
                trackAlbum:true
              }
            }
          }
        });

        return {
          count:count,
          albums:albums
        }
    }),

    getAllFeatured: publicProcedure
    .query(async({ ctx }) => {
      return await ctx.db.genre.findMany({
        where:{
          is_featured:true
        },
        select:{
            id:true,
            name:true,
        },
        orderBy:{
          name:'asc'
        }
      })
    }),


});
