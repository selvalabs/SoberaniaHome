import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSitePolicy } from '../src/lib/site-policy.mjs';

test('unconfigured production build remains a preview', () => {
  assert.deepEqual(resolveSitePolicy({}, true), { siteUrl: undefined, indexable: false });
});

test('development is not indexable even with production settings', () => {
  assert.equal(resolveSitePolicy({ PUBLIC_INDEXABLE: 'true', PUBLIC_SITE_URL: 'https://example.com/' }, false).indexable, false);
});

test('production requires both explicit approval and a valid origin', () => {
  assert.equal(resolveSitePolicy({ PUBLIC_SITE_URL: 'https://example.com' }, true).indexable, false);
  assert.deepEqual(resolveSitePolicy({ PUBLIC_INDEXABLE: 'true', PUBLIC_SITE_URL: 'https://example.com' }, true), {
    siteUrl: 'https://example.com/', indexable: true,
  });
  assert.throws(() => resolveSitePolicy({ PUBLIC_INDEXABLE: 'true' }, true), /requires/);
  assert.throws(() => resolveSitePolicy({ PUBLIC_INDEXABLE: '1' }, true), /must be/);
});

test('a configured false flag remains nonindexable', () => {
  assert.equal(resolveSitePolicy({ PUBLIC_INDEXABLE: 'false', PUBLIC_SITE_URL: 'https://example.com/' }, true).indexable, false);
});

test('unsafe origins and unsupported subpath deployments fail visibly', () => {
  for (const url of [
    'http://example.com/', 'https://localhost/', 'https://127.0.0.1/',
    'https://192.168.3.204/', 'https://[::1]/', 'https://device.local/',
    'https://stage.test/', 'https://host.example/', 'https://example.com:444/',
    'https://user:password@example.com/', 'https://example.com/SoberaniaHome/',
    'https://example.com/?preview=1', 'https://example.com/#hero', 'not a URL',
  ]) {
    assert.throws(() => resolveSitePolicy({ PUBLIC_SITE_URL: url }, true), /PUBLIC_SITE_URL/, url);
  }
});
