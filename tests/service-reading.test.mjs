import test from 'node:test';
import assert from 'node:assert/strict';
import {serviceReading} from '../src/lib/service-reading.js';
import {projectServiceLinks} from '../src/lib/project-service-links.js';
test('Geodesy copy preserves answers and splits questions, without repeating headings', () => {
 const body = 'Hansı planı sifariş etməliyəm? Miqyası razılaşdırın. İş nə qədər çəkir? Sahədən asılıdır.';
 const result = serviceReading('geodeziya-topoqrafiya-xidmetleri','az','Total Station ilə geodeziya ölçmələri',body);
 assert.match(result.text, /### Hansı planı sifariş etməliyəm\?\n\n Miqyası razılaşdırın/);
 assert.match(result.text, /Sahədən asılıdır/);
 assert.deepEqual(serviceReading('geodeziya-topoqrafiya-xidmetleri','az',result.heading,result.text),result);
 assert.equal(serviceReading('kalibrasiya','az','Custom',body).text,body);
 assert.equal(serviceReading('geodeziya-topoqrafiya-xidmetleri','en','Custom',body).text,body);
});
test('Known projects link directly to localized public service routes', () => {
 for (const locale of ['az','en','ru','ky']) {
  for (const project of ['crescent','hadrut-restoration']) {
   const links = projectServiceLinks(project,locale);
   assert.equal(links.items.length,2);
   for(const item of links.items) assert.ok(item.href.startsWith(`/${locale}/xidmetler/`));
  }
 }
 assert.equal(projectServiceLinks('unknown','az'),null);
 assert.equal(projectServiceLinks('crescent','xx'),null);
});
