/** Shared publication policy. Development and unconfigured builds stay previews. */
export function resolveSitePolicy(values = {}, production = false) {
  const basePath = values.PUBLIC_BASE_PATH || '/';
  if (basePath.length > 200 || !/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(basePath)) {
    throw new Error('PUBLIC_BASE_PATH must be a slash-delimited local path, such as /SoberaniaHome/.');
  }
  const requested = values.PUBLIC_INDEXABLE;
  if (requested && requested !== 'true' && requested !== 'false') {
    throw new Error('PUBLIC_INDEXABLE must be "true" or "false".');
  }

  let siteUrl;
  const suppliedUrl = values.PUBLIC_SITE_URL?.trim();
  if (suppliedUrl) {
    let parsed;
    try { parsed = new URL(suppliedUrl); }
    catch { throw new Error('PUBLIC_SITE_URL must be an absolute HTTPS origin.'); }
    const hostname = parsed.hostname.toLowerCase();
    const localHost = !hostname.includes('.') || hostname.includes(':') ||
      /^[\d.]+$/.test(hostname) || /\.(localhost|local|localdomain|internal|test|invalid|example)$/.test(hostname);
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.port ||
        parsed.search || parsed.hash || parsed.pathname !== '/' || localHost) {
      throw new Error('PUBLIC_SITE_URL must be a confirmed public HTTPS origin, without credentials, port, query, fragment or subdirectory.');
    }
    siteUrl = parsed.href;
  }
  if (requested === 'true' && !siteUrl) {
    throw new Error('PUBLIC_INDEXABLE=true requires a confirmed PUBLIC_SITE_URL.');
  }

  return { siteUrl, basePath, indexable: production && requested === 'true' && Boolean(siteUrl) };
}

export function localPath(path, basePath = '/') {
  if (!path.startsWith('/') || path.startsWith('//')) throw new Error('Expected a local absolute path.');
  return basePath === '/' || path.startsWith(basePath) ? path : basePath + path.slice(1);
}
