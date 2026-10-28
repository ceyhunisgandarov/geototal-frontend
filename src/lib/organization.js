import {seoSite} from './seo.js';
// Keep structured data limited to the public company identity; no unverified metrics.
export function organizationData(host, locale) {
 const {origin} = seoSite(host, locale);
 const kg = origin.endsWith('.kg');
 return {
  '@context': 'https://schema.org', '@type': 'Organization',
  '@id': `${origin}/#organization`,
  name: kg ? 'Филиал ООО «Гео Тотал» в Кыргызской Республике' : 'GeoTotal MMC',
  url: origin,
 };
}
export function serializeStructuredData(data) {
 return JSON.stringify(data).replace(/</g, '\\u003c');
}
