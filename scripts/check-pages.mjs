import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const dir = process.argv[2];
if (!dir) throw Error('Usage: node scripts/check-pages.mjs ARTIFACT');
const release = JSON.parse(fs.readFileSync(path.join(dir, 'release.json'), 'utf8'));
assert.match(release.commit, /^[a-f0-9]{40}$/);
assert.match(release.tag, /^v\d+\.\d+\.\d+$/);
assert.equal(release.url, 'https://selvalabs.github.io/SoberaniaHome/');
assert.equal(release.sections, 16);
assert.equal(release.externalAI, false);
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
assert.match(html, /precisa chegar a/);
assert.match(html, /Saberes diferentes/);
assert.equal((html.match(/data-number="\d+"/g) || []).length, 16);
assert.match(html, /name="robots" content="index,follow,max-image-preview:large"/);
assert.ok(html.includes(`rel="canonical" href="${release.url}"`));
assert.ok(html.includes(`${release.url}assets/social/edition-og.png`));
assert.ok(fs.existsSync(path.join(dir, '.nojekyll')));
let checked = 0;
function visit(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) { visit(file); continue; }
    if (!['.html', '.css', '.js', '.mjs', '.json', '.svg'].includes(path.extname(file))) continue;
    const text = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(text, /["'`]\/(?:assets|scripts|demos|_astro|perguntas)\//, `Root URL in ${file}`);
    assert.doesNotMatch(text, /url\(["']?\/assets\//, `Root CSS URL in ${file}`);
    if (file.endsWith('.html')) {
      for (const match of text.matchAll(/(?:src|href|poster)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
        const local = match[1]; if (local.startsWith('//')) continue;
        assert.ok(local.startsWith(release.basePath), `Escaping URL in ${file}: ${local}`);
        const relative = local.slice(release.basePath.length);
        const target = path.resolve(dir, relative.endsWith('/') || !relative ? relative + 'index.html' : relative);
        assert.ok(target.startsWith(path.resolve(dir) + path.sep), `Escaping file: ${target}`);
        assert.ok(fs.existsSync(target), `Missing ${local} in ${file}`); checked++;
      }
    }
  }
}
visit(dir);
for (const name of ['perguntas/index.html', 'llms.txt', 'robots.txt', 'sitemap.xml']) {
  const content = fs.readFileSync(path.join(dir, name), 'utf8');
  assert.ok(content.includes(release.url), `Published URL missing in ${name}`);
}
console.log(`PASS Pages artifact: ${checked} local references, metadata, full edition and immutable release identity.`);
