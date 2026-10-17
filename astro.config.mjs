import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { resolveSitePolicy } from './src/lib/site-policy.mjs';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const values = { ...loadEnv(mode, process.cwd(), 'PUBLIC_'), ...process.env };
const publication = resolveSitePolicy(values, mode === 'production');

export default defineConfig({
  ...(publication.siteUrl ? { site: publication.siteUrl } : {}),
  outDir: process.env.BUILD_DIR || './.edition-builds/latest/',
  trailingSlash: 'always',
  compressHTML: true,
  vite: { build: { emptyOutDir: false } },
  server: {
    port: 4321,
    host: true
  }
});
