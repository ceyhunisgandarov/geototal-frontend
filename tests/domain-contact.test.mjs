import test from 'node:test';
import assert from 'node:assert/strict';
import { getDomainContact } from '../src/lib/domain-contact.js';
import { getRequestHost } from '../src/lib/locales.js';

for (const host of ['geototal.kg', 'www.geototal.kg', 'WWW.GEOTOTAL.KG.:3000']) {
  test(`${host}: Kyrgyz branch contacts and WhatsApp destination`, () => {
    const contact = getDomainContact(host);
    assert.equal(contact.emailAddress[0], 'info@geototal.kg');
    assert.equal(contact.whatsappUrl, 'https://wa.me/996703448444');
    assert.ok(contact.address.includes('Бишкек'));
    assert.equal(contact.phoneNumbers.length, 3);
  });
}

test('Azerbaijan and development hosts retain existing contact sources', () => {
  for (const host of ['geototal.az', 'www.geototal.az', 'localhost:3000', '', 'geototal.kg.example.com']) {
    assert.equal(getDomainContact(host), null);
  }
});

test('proxied Kyrgyz requests select the branch independently of language', () => {
  for (const locale of ['ky', 'ru', 'en']) {
    const headers = new Headers({ host: 'localhost:3000', 'x-forwarded-host': 'geototal.kg', 'accept-language': locale });
    assert.equal(getDomainContact(getRequestHost(headers)).whatsappUrl, 'https://wa.me/996703448444');
  }
});
