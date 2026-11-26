import type { APIRoute } from 'astro';
import { SITE } from '../data/profile';

const pages = [
  { loc: '/', pri: '1.0' },
  { loc: '/cv/', pri: '0.8' },
  { loc: '/llms.txt', pri: '0.3' },
];
export const GET: APIRoute = () => {
  const today = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map((p) => `  <url><loc>${SITE}${p.loc}</loc><lastmod>${today}</lastmod><priority>${p.pri}</priority>${p.loc.endsWith('/') ? `<xhtml:link rel="alternate" hreflang="en" href="${SITE}${p.loc}"/><xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${p.loc}"/>` : ''}</url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
