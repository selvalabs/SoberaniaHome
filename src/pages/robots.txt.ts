import type { APIRoute } from 'astro';
import { publication } from '../lib/seo';

export const GET: APIRoute = () => {
  const lines = [
    '# Soberania Labs. This file is not an access-control mechanism.',
    ...(!publication.indexable ? ['# Experimental edition: HTML pages declare noindex.'] : []),
    'User-agent: *',
    'Allow: /',
    ...(publication.indexable ? ['', `Sitemap: ${new URL('/sitemap.xml', publication.siteUrl).href}`] : []),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
