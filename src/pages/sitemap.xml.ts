import type { APIRoute } from 'astro';

/**
 * Dynamic Sitemap Generator untuk Portfolio Rosfendik
 *
 * Sitemap ini mencakup halaman utama beserta setiap section
 * agar crawler (Googlebot, Bingbot, dll) dapat memahami
 * struktur konten dan mengindeks secara lebih optimal.
 *
 * Referensi: https://www.sitemaps.org/protocol.html
 */

interface SitemapEntry {
  path: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  lastmod?: string;
}

const TODAY = new Date().toISOString().split('T')[0];

/**
 * Daftar URL yang dimasukkan ke sitemap.
 *
 * Catatan: Anchor fragment (#section) secara teknis adalah bagian dari
 * halaman yang sama — Google pada umumnya tidak mengindeks mereka sebagai
 * URL terpisah. Namun, menyertakannya membantu crawler memahami
 * struktur konten dan meningkatkan relevansi crawling.
 *
 * priority  → 0.0 (rendah) s/d 1.0 (tinggi)
 * changefreq → seberapa sering konten berubah (mempengaruhi jadwal recrawl)
 */
const pages: SitemapEntry[] = [
  {
    // Halaman utama — Hero section (Home)
    path: '/',
    changefreq: 'monthly',
    priority: '1.0',
    lastmod: TODAY,
  },
  {
    // Section About — informasi profil & pengalaman karir
    path: '/#about',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: TODAY,
  },
  {
    // Section Projects — portofolio proyek (sering diupdate)
    path: '/#projects',
    changefreq: 'weekly',
    priority: '0.9',
    lastmod: TODAY,
  },
  {
    // Section Statistics — statistik GitHub & kontribusi
    path: '/#statistics',
    changefreq: 'weekly',
    priority: '0.6',
    lastmod: TODAY,
  },
];

function buildSitemap(baseUrl: string, entries: SitemapEntry[]): string {
  const urls = entries
    .map(({ path, changefreq, priority, lastmod }) => {
      const loc = `${baseUrl}${path}`;
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`;
}

export const GET: APIRoute = ({ site }) => {
  // Ambil base URL dari astro.config.mjs (field `site`)
  // Fallback ke domain placeholder jika belum dikonfigurasi
  const baseUrl = site
    ? site.href.replace(/\/$/, '')
    : 'https://rosfendik.dev';

  const xml = buildSitemap(baseUrl, pages);

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400', // cache 1 hari
    },
  });
};
