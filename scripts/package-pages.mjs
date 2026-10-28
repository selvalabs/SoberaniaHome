import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolveSitePolicy } from '../src/lib/site-policy.mjs';

// Relocate only local URLs. External origins, anchors, relative demo resources,
// source files and the root development build are preserved.
export function relocatePages(text, extension, base) {
  if (base === '/') return text;
  let result = text.replace(/(["'`])\/(?=(?:assets|scripts|demos|_astro|perguntas|favicon\.svg|robots\.txt|sitemap\.xml|llms\.txt|api)(?:\/|["'`?#]))/g, `$1${base}`);
  if (['.html', '.svg'].includes(extension)) {
    result = result.replace(/(\b(?:src|href|poster|data-[\w-]+)\s*=\s*["'])\/(?!\/)/g,
      (match, prefix, offset, source) => source.slice(offset + prefix.length).startsWith(base) ? match : prefix + base);
  }
  if (['.css', '.html', '.svg'].includes(extension)) {
    result = result.replace(/(url\(\s*["']?)\/(?!\/)/g,
      (match, prefix, offset, source) => source.slice(offset + prefix.length).startsWith(base) ? match : prefix + base);
  }
  return result;
}

export function packagePages(source, output, values = process.env) {
  const policy = resolveSitePolicy(values, true);
  if (!policy.indexable) throw Error('Pages packaging requires the confirmed public origin and indexable production build.');
  const input = fs.realpathSync(source);
  if (values.PUBLIC_EDGE_AI === 'true' || !fs.readFileSync(path.join(input, 'index.html'), 'utf8').includes('data-edge-enabled="false"')) {
    throw Error('The static Pages release must keep external AI disabled.');
  }
  const target = path.resolve(output);
  if (fs.existsSync(target)) throw Error('Output already exists. Choose a fresh output; nothing was removed.');
  if (target === input || target.startsWith(input + path.sep)) throw Error('Output must be outside the source build.');
  if (!/^v\d+\.\d+\.\d+$/.test(values.RELEASE_TAG || '')) throw Error('RELEASE_TAG must identify a version.');
  const identity = {
    commit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    tag: values.RELEASE_TAG,
    url: new URL(policy.basePath, policy.siteUrl).href,
    basePath: policy.basePath,
    sections: 17,
    edition: 'complete',
    externalAI: false,
  };
  const textTypes = new Set(['.html', '.css', '.js', '.mjs', '.json', '.svg', '.txt', '.xml']);
  let count = 0, bytes = 0;
  function copy(folder, relative = '') {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) throw Error(`Symlink is not allowed in the public artifact: ${entry.name}`);
      const local = path.join(relative, entry.name);
      const from = path.join(input, local), to = path.join(target, local);
      if (entry.isDirectory()) { fs.mkdirSync(to, { recursive: true }); copy(from, local); }
      else if (entry.isFile()) {
        if (/(?:^|[\\/])(?:\.env[^\\/]*|\.git|node_modules)(?:[\\/]|$)/.test(local)) throw Error(`Private file in artifact: ${local}`);
        const extension = path.extname(local).toLowerCase();
        const content = textTypes.has(extension)
          ? Buffer.from(relocatePages(fs.readFileSync(from, 'utf8'), extension, policy.basePath))
          : fs.readFileSync(from);
        fs.writeFileSync(to, content, { flag: 'wx' }); count++; bytes += content.length;
      }
    }
  }
  fs.mkdirSync(target, { recursive: true });
  copy(input);
  fs.writeFileSync(path.join(target, '.nojekyll'), '', { flag: 'wx' });
  fs.writeFileSync(path.join(target, 'release.json'), JSON.stringify(identity, null, 2) + '\n', { flag: 'wx' });
  console.log(`Pages artifact: ${identity.url}, ${identity.commit}, ${identity.tag}, ${count} files, ${bytes} bytes.`);
  return identity;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 4) throw Error('Usage: node scripts/package-pages.mjs SOURCE_BUILD FRESH_OUTPUT');
  packagePages(process.argv[2], process.argv[3]);
}
