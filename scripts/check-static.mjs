import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const dir=process.argv[2];
if(!dir)throw Error('Usage: node scripts/check-static.mjs BUILD_DIRECTORY');
const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
assert.match(html,/<html lang="pt-BR"/);
assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
assert.match(html,/name="robots" content="noindex,follow"/);
assert.doesNotMatch(html,/<link rel="canonical"/);
assert.doesNotMatch(html,/href="#"/);
const files=['perguntas/index.html','llms.txt','robots.txt','sitemap.xml','favicon.svg','assets/social/edition-og.png'];
for(const file of files)assert.ok(fs.statSync(path.join(dir,file)).size>0,file);
for(const match of html.matchAll(/(?:src|href)="(\/[^"#?]+)(?:[?#][^"]*)?"/g)){
 const url=match[1];
 const target=path.join(dir,url.endsWith('/')?url+'index.html':url);
 assert.ok(fs.existsSync(target),`Missing local resource ${url}`);
}
for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(match[1]);
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'assets/edition/manifest.json'),'utf8'));
for(const asset of Object.values(manifest))assert.ok(fs.existsSync(path.join(dir,asset.src)),asset.src);
assert.doesNotMatch(fs.readFileSync(path.join(dir,'sitemap.xml'),'utf8'),/<loc>/);
console.log('PASS static output: metadata, structured data, endpoints, local links and optimized images');
