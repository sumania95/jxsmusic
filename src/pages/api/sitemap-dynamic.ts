// src/pages/api/sitemap-dynamic.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tracks = await db.track.findMany({
      where: { is_published: true },
      select: { id: true, releaseAt: true },
      take:30,
      orderBy: { releaseAt: "desc" }
    });

    const packs = await db.album.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      take:5,
      orderBy: { updatedAt: "desc" }
    });

    const editors = await db.user.findMany({
      take:20,
      where: { is_uploader: true },
      select: { id: true, updatedAt: true },
    });

    const urls: { loc: string; lastmod: string }[] = [];

    tracks.forEach((t) =>{
      urls.push({ loc: `/tracks/${t.id}`, lastmod: t.releaseAt?.toISOString() ?? new Date().toISOString() });
      urls.push({ loc: `/tracks/${t.id}?tab=related`, lastmod: t.releaseAt?.toISOString() ?? new Date().toISOString() });
      urls.push({ loc: `/tracks/${t.id}?tab=related-key`, lastmod: t.releaseAt?.toISOString() ?? new Date().toISOString() });
    });

    packs.forEach((p) =>
      urls.push({ loc: `/multi-packs/${p.slug}`, lastmod: p.updatedAt.toISOString() })
    );

    editors.forEach((e) => {
      urls.push({ loc: `/editors/${e.id}`, lastmod: e.updatedAt.toISOString() });
      urls.push({ loc: `/editors/${e.id}?tab=packs`, lastmod: e.updatedAt.toISOString() });
      urls.push({ loc: `/editors/${e.id}?tab=info`, lastmod: e.updatedAt.toISOString() });
    });

    res.status(200).json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
}
