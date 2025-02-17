import { writeFileSync } from "fs";
import { join } from "path";
import { SitemapStream, streamToPromise } from "sitemap";

const hostname = "https://www.konaseemakart.in/";

const pages = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/home", changefreq: "daily", priority: 0.9 },
  { url: "/restaurants", changefreq: "weekly", priority: 0.8 },
  { url: "/restaurants/menu", changefreq: "weekly", priority: 0.7 },
  { url: "/search", changefreq: "monthly", priority: 0.6 },
  { url: "/profile", changefreq: "monthly", priority: 0.5 },
  { url: "/cart", changefreq: "daily", priority: 0.8 },
  { url: "/admin", changefreq: "monthly", priority: 0.4 },
  { url: "/auth", changefreq: "monthly", priority: 0.5 },
];

async function generateSitemap() {
  const sitemapStream = new SitemapStream({ hostname });

  pages.forEach((page) => sitemapStream.write(page));
  sitemapStream.end();

  const sitemap = await streamToPromise(sitemapStream).then((data) =>
    data.toString()
  );

  writeFileSync(join(process.cwd(), "public", "sitemap.xml"), sitemap);
  console.log("✅ Sitemap.xml generated successfully!");
}

generateSitemap().catch(console.error);
