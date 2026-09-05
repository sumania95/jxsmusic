import { env } from "@/env";
import Head from "next/head";

type MetaProps = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: "website" | "profile" | "music" | "article";
};

export const ProfileMeta = ({
  title,
  description,
  url,
  image,
  type = "profile",
}: MetaProps) => {
  const siteUrl = env.NEXT_PUBLIC_APP_URL;

  const ogTitle = title ? `${title}` : "Jeff92 & Ayan Sumania";

  const ogDescription =
    description?.trim() ??
    "Find the edit. Move the room. Set-ready DJ edits from verified editors.";

  const ogUrl = url ?? siteUrl;

  const ogImage = image?.startsWith("http")
    ? image
    : `${siteUrl}${image ?? "/images/jeff92-ayan-brand-logo.svg"}`;

  return (
    <Head>
      {/* Basic SEO */}
      <title>{ogTitle}</title>
      <meta name="description" content={ogDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/images/favicon.ico" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:site_name" content="Jeff92 & Ayan Sumania" />

      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <link rel="canonical" href={ogUrl} />

      <meta property="fb:app_id" content="966242223397117" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
};
