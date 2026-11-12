import test from 'node:test';
import assert from 'node:assert/strict';
import {regionalServiceRecord} from '../src/lib/regional-content.js';
import {contentRegionalLanguages,regionalAlternates} from '../src/lib/regional-alternates.js';
import {sitemapXml} from '../src/lib/crawl.js';
import {pageMetadata} from '../src/lib/seo.js';
test('Regional overrides never cross domains; blank overrides keep shared content',()=>{
 const original={seoTitleEn:'Shared title',seoTitleAzerbaijanEn:'AZ title',seoTitleKyrgyzstanEn:'  ',serviceParts:[{serviceTextEn:'Shared body',serviceTextAzerbaijanEn:'AZ body',serviceTextKyrgyzstanEn:'KG body',serviceTextAz:'AZ language',serviceTextKy:'KY language'}]};
 const frozen=JSON.stringify(original);const az=regionalServiceRecord(original,'AZ'),kg=regionalServiceRecord(original,'KG');
 assert.equal(az.seoTitleEn,'AZ title');assert.equal(kg.seoTitleEn,'Shared title');assert.equal(az.serviceParts[0].serviceTextEn,'AZ body');assert.equal(kg.serviceParts[0].serviceTextEn,'KG body');
 assert.equal(kg.serviceParts[0].serviceTextKy,'KY language');assert.equal(JSON.stringify(original),frozen);assert.equal(regionalServiceRecord(original,'unknown'),original);
});
test('A region-only translation creates the same reciprocal cluster in HTML and sitemap',()=>{
 const record={pathName:'survey',serviceNameEn:'Survey',serviceParts:[{serviceTextAzerbaijanEn:'Only AZ translation'}]};
 const available=contentRegionalLanguages('service',record);assert.deepEqual(available,['en-AZ']);
 const alternatives=regionalAlternates('xidmetler/survey',available);assert.ok(alternatives['en-AZ']);assert.equal(alternatives['en-KG'],undefined);
 for(const [host,expected] of [['www.geototal.az',true],['www.geototal.kg',false]]) {
  const meta=pageMetadata({host,locale:'en',page:'services',path:'xidmetler/survey',availableLanguages:available});
  assert.deepEqual(meta.alternates.languages,alternatives);assert.equal(meta.robots?.index!==false,expected);
  const xml=sitemapXml(host,{services:[record],projects:[],products:[]});assert.equal(xml.includes(`<loc>${meta.alternates.canonical}</loc>`),expected);
 }
});
