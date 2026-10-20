import { localPath, resolveSitePolicy } from './site-policy.mjs';

export const publication = resolveSitePolicy(import.meta.env, import.meta.env.PROD);

export const siteIdentity = {
  name: 'Soberania Labs',
  language: 'pt-BR',
  title: 'Soberania Labs — Software, IA e autonomia digital',
  description: 'Laboratório independente em Florianópolis. Software, automação e infraestrutura digital com autonomia, conhecimento compartilhado e compromisso social.',
  image: '/assets/social/edition-og.png',
  imageAlt: 'Soberania Labs. Tecnologia a serviço da humanidade: software, conhecimento e autonomia.',
};

export const publicPages = ['/', '/perguntas/'];

export function publicUrl(path: string) {
  const local = localPath(path, publication.basePath);
  return publication.indexable ? new URL(local, publication.siteUrl).href : local;
}

export function canonicalUrl(path: string) {
  if (!publication.indexable) return undefined;
  const result = new URL(localPath(path, publication.basePath), publication.siteUrl);
  result.search = '';
  result.hash = '';
  return result.href;
}

export function pageStructuredData(path: string, title: string, description: string) {
  const canonical = canonicalUrl(path);
  const home = publication.indexable ? publicUrl('/') : undefined;
  const organizationId = `${home || '/'}#organization`;
  const websiteId = `${home || '/'}#website`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: siteIdentity.name,
        ...(home ? { url: home } : {}),
        description: siteIdentity.description,
        location: {
          '@type': 'Place',
          name: 'Florianópolis, Brasil',
          address: { '@type': 'PostalAddress', addressLocality: 'Florianópolis', addressRegion: 'SC', addressCountry: 'BR' },
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: siteIdentity.name,
        ...(home ? { url: home } : {}),
        inLanguage: siteIdentity.language,
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical || path}#webpage`,
        ...(canonical ? { url: canonical } : {}),
        name: title,
        description,
        inLanguage: siteIdentity.language,
        isPartOf: { '@id': websiteId },
        about: { '@id': organizationId },
      },
    ],
  };
}

/** Avoid closing a JSON-LD script if a future description contains HTML. */
export function serializeStructuredData(value: unknown) {
  return (JSON.stringify(value) ?? 'null').replace(/</g, '\\u003c');
}
