import test from 'node:test';
import assert from 'node:assert/strict';
import {organizationData,serializeStructuredData} from '../src/lib/organization.js';
test('Organization identity follows the domain, including English on KG',()=>{
 const az=organizationData('www.geototal.az','az'),kg=organizationData('www.geototal.kg','en');
 assert.equal(az['@type'],'Organization');assert.equal(az.url,'https://www.geototal.az');
 assert.equal(kg.url,'https://www.geototal.kg');assert.notEqual(az.name,kg.name);
 assert.equal(organizationData('evil.test','az').url,az.url);
});
test('Structured data cannot close its script element and remains valid JSON',()=>{
 const data={name:'</script><script>alert(1)</script>'};const text=serializeStructuredData(data);
 assert.ok(!text.includes('<'));assert.deepEqual(JSON.parse(text),data);
});
test('Contact schema uses supplied branch data and localized address',()=>{
 const contact={phoneNumbers:['+996703448444'],emailAddress:['info@geototal.kg'],address:'Bishkek',addressRu:'Бишкек'};
 const data=organizationData('www.geototal.kg','ru',contact);
 assert.equal(data.address.addressCountry,'KG');
 assert.equal(data.address.streetAddress,'Бишкек');
 assert.deepEqual(data.telephone,contact.phoneNumbers);
 assert.deepEqual(data.email,contact.emailAddress);
 assert.equal(organizationData('www.geototal.az','az').address,undefined);
});
