import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire, register } from 'node:module';
register('data:text/javascript,' + encodeURIComponent(`export async function resolve(specifier, context, nextResolve) { return nextResolve(specifier === 'next/server' ? 'next/server.js' : specifier, context); }`), import.meta.url);
const intlMiddleware = await import('next-intl/middleware');
import vm from 'node:vm';
import * as locales from '../src/lib/locales.js';
const require = createRequire(import.meta.url);
const { NextRequest } = require('next/server');
const babel = require('next/dist/compiled/babel/core');
const code = babel.transformSync(readFileSync(new URL('../middleware.js', import.meta.url), 'utf8'), {
  presets: [[require.resolve('next/babel'), { 'transform-runtime': false }]], filename: 'middleware.js',
  caller: { name: 'test', supportsStaticESM: false }
}).code;
const module = { exports: {} };
vm.runInNewContext(code, { module, exports: module.exports, require(name) {
  if (name === 'next-intl/middleware') return { __esModule: true, default: intlMiddleware.default };
  if (name.startsWith('@babel/runtime/')) return require(`next/dist/compiled/${name}`);
  if (name.includes('/lib/locales')) return locales;
  if (name.includes('/i18n/routing')) return { routing: { locales: locales.supportedLocales, defaultLocale: 'az' } };
  return require(name);
}});
const middleware = module.exports.default;
for (const [host, lang, blocked] of [['geototal.az', 'az', 'ky'], ['www.geototal.kg', 'ky', 'az']]) {
  test(`${host}: root ignores stale cookies and browser language`, () => {
    const response = middleware(new NextRequest(`https://${host}/`, {headers: {host, cookie: 'NEXT_LOCALE=ru', 'accept-language': 'en'}}));
    assert.equal(new URL(response.headers.get('location')).pathname, `/${lang}`);
  });
  test(`${host}: blocked locale preserves detail path and query`, () => {
    const response = middleware(new NextRequest(`https://${host}/${blocked}/products/7?q=test`, {headers: {host}}));
    assert.equal(response.headers.get('location'), `https://${host}/${lang}/products/7?q=test`);
  });
  for (const allowed of [lang, 'en', 'ru']) test(`${host}: ${allowed} stays accessible`, () => {
    const response = middleware(new NextRequest(`https://${host}/${allowed}/products/7`, {headers: {host}}));
    assert.equal(response.headers.get('location'), null);
    assert.ok(!response.headers.get('link')?.includes(`/${blocked}/`));
  });
}
test('host normalization, proxy and non-country hosts', () => {
  assert.deepEqual(locales.getDomainLocales('WWW.GEOTOTAL.KG.:3000').locales, ['ky', 'en', 'ru']);
  assert.equal(locales.getDomainLocales(locales.getRequestHost(new Headers({'x-forwarded-host':'geototal.kg',host:'localhost:3000'}))).defaultLocale, 'ky');
  for (const host of ['localhost:3000', 'geototal.com', 'geototal.az.example.com']) assert.deepEqual(locales.getDomainLocales(host).locales, ['az', 'en', 'ru', 'ky']);
});
