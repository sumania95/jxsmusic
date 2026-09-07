const SITE_URL = "https://www.jxsmusic.com";

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.8,
  sitemapSize: 500,
  // exclude: ["/api/*"],
  exclude: [
    "/restricted/*",
    "/payment/*",
    "/auth/*",
    "/my-cart",
    "/editors",
    "/reviews/*",
    "/my-order",
    "/become-editor",
    "/new-year-countdown",
  ],

  transform: async (config, url) => ({
    loc: url,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: new Date().toISOString(),
  }),

  additionalPaths: async () => {
    // const res = await fetch(`${SITE_URL}/api/sitemap-dynamic`);
    // const dynamicUrls = await res.json();

    const staticPages = [
      "",
      "/tracks",
      "/multi-packs",
      "/charts",
      "/contact-us",
      "/how-to-buy",
      "/subscriptions",
      "/privacy-policy",
      "/refund-policy",
      "/terms",
      "/help",
    ].map((p) => ({
      loc: `${SITE_URL}${p}`,
      lastmod: new Date().toISOString(),
    }));

    // return [...staticPages];
    // return [...staticPages, ...dynamicUrls.map((/** @type {{ loc: any; lastmod: any; }} */ u) => ({ loc: `${SITE_URL}${u.loc}`, lastmod: u.lastmod }))];
    return [...staticPages];
  },
};

export default config;
