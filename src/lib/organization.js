import {localizedText} from './localizedText.js';
import {seoSite} from './seo.js';
// Keep structured data limited to the public company identity; no unverified metrics.
export function organizationData(host, locale, contact = null) {
 const {origin} = seoSite(host, locale);
 const kg = origin.endsWith('.kg');
 return {
  '@context': 'https://schema.org', '@type': 'Organization',
  '@id': `${origin}/#organization`,
  name: kg ? 'Филиал ООО «Гео Тотал» в Кыргызской Республике' : 'GeoTotal MMC',
  url: origin,
  ...(contact?.phoneNumbers?.length ? {telephone: contact.phoneNumbers} : {}),
  ...(contact?.emailAddress?.length ? {email: contact.emailAddress} : {}),
  ...(localizedText(contact, 'address', locale) ? {address: {
   '@type': 'PostalAddress',
   streetAddress: localizedText(contact, 'address', locale),
   addressCountry: kg ? 'KG' : 'AZ',
  }} : {}),
 };
}
export function serializeStructuredData(data) {
 return JSON.stringify(data).replace(/</g, '\\u003c');
}
