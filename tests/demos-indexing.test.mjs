import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const demoRoot = new URL('../public/demos/', import.meta.url);

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const url = new URL(encodeURIComponent(entry.name) + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) files.push(...await htmlFiles(url));
    else if (/\.html?$/i.test(entry.name)) files.push(url);
  }
  return files;
}

test('every shipped demonstration declares noindex in its HTML head', async () => {
  const files = await htmlFiles(demoRoot);
  assert.ok(files.length >= 5, 'The five known demo pages must be inspected.');
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
    assert.ok(head, `${file.pathname}: missing document head`);
    const meta = [...head.matchAll(/<meta\b[^>]*>/gi)].map(match => match[0])
      .find(tag => /\bname\s*=\s*["']robots["']/i.test(tag));
    assert.ok(meta, `${file.pathname}: missing robots meta tag`);
    const content = meta.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1] || '';
    const directives = content.toLowerCase().split(/[\s,]+/);
    assert.ok(directives.includes('noindex'), `${file.pathname}: demo can be indexed`);
    assert.ok(directives.includes('follow'), `${file.pathname}: demo links should remain readable`);
    assert.ok(!directives.includes('index'), `${file.pathname}: conflicting indexing directive`);
  }
});
