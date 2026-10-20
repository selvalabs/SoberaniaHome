import type { APIRoute } from 'astro';
import { publication, publicUrl } from '../lib/seo';

export const GET: APIRoute = () => {
  const lines = [
    '# Soberania Labs. This file is not an access-control mechanism.',
    ...(!publication.indexable ? ['# Experimental edition: HTML pages declare noindex.'] : []),
    'User-agent: *',
    'Allow: /',
    ...(publication.indexable ? ['', `Sitemap: ${publicUrl('/sitemap.xml')}`] : []),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
