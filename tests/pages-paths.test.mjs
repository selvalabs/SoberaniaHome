import test from 'node:test';
import assert from 'node:assert/strict';
import { relocatePages } from '../scripts/package-pages.mjs';

test('Pages relocation covers HTML, CSS, data and dynamic imports without changing external or relative URLs', () => {
  const base = '/SoberaniaHome/';
  const samples = [
    ['.html', '<a href="/"><img src="/assets/a.webp"></a><a href="/#hero">Home</a>', '<a href="/SoberaniaHome/"><img src="/SoberaniaHome/assets/a.webp"></a><a href="/SoberaniaHome/#hero">Home</a>'],
    ['.css', 'a{background:url(/assets/a.webp)}b{background:url("/assets/b.webp")}', 'a{background:url(/SoberaniaHome/assets/a.webp)}b{background:url("/SoberaniaHome/assets/b.webp")}'],
    ['.js', 'import("/_astro/motion.js");img.src="/assets/x.webp";fetch("/api/atelier")', 'import("/SoberaniaHome/_astro/motion.js");img.src="/SoberaniaHome/assets/x.webp";fetch("/SoberaniaHome/api/atelier")'],
    ['.json', '{"src":"/assets/x.webp"}', '{"src":"/SoberaniaHome/assets/x.webp"}'],
  ];
  for (const [ext, input, expected] of samples) {
    assert.equal(relocatePages(input, ext, base), expected);
    assert.equal(relocatePages(expected, ext, base), expected, 'relocation must be idempotent');
    assert.equal(relocatePages(input, ext, '/'), input);
  }
  const untouched = '<a href="https://example.org/assets/a">External</a><a href="//example.org/">CDN</a><a href="#hero">Anchor</a><img src="../assets/a.webp">';
  assert.equal(relocatePages(untouched, '.html', base), untouched);
});
