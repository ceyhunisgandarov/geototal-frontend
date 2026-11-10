import test from 'node:test';
import assert from 'node:assert/strict';
import {pageMetadata} from '../src/lib/seo.js';
import {blogMetadata} from '../src/lib/blog-metadata.js';
import {sitemapXml} from '../src/lib/crawl.js';
test('Country variants are reciprocal and retain their own canonical',()=>{
 const path='xidmetler/geodeziya-topoqrafiya-xidmetleri';
 const az=pageMetadata({host:'www.geototal.az',locale:'en',path});
 const kg=pageMetadata({host:'www.geototal.kg',locale:'en',path});
 assert.deepEqual(az.alternates.languages,kg.alternates.languages);
 assert.equal(az.alternates.canonical,az.alternates.languages['en-AZ']);
 assert.equal(kg.alternates.canonical,kg.alternates.languages['en-KG']);
 assert.equal(Object.keys(az.alternates.languages).length,7);
});
test('Both sitemaps use metadata alternates, but list only own-domain locations',()=>{
 for(const host of ['www.geototal.az','www.geototal.kg']) {
  const xml=sitemapXml(host,{services:[],projects:[],products:[]});
  for(const [,url] of xml.matchAll(/<loc>(.*?)<\/loc>/g))assert.equal(new URL(url).host,host);
  for(const [lang,url] of Object.entries(pageMetadata({host,path:''}).alternates.languages))
   assert.ok(xml.includes(`hreflang="${lang}" href="${url}"`));
 }
});
test('Missing blog translations never generate alternate URLs',()=>{
 const record={slug:'example',published:true,titleEn:'Title',descriptionEn:'Text'};
 const az=blogMetadata('www.geototal.az','en',record);
 const kg=blogMetadata('www.geototal.kg','en',record);
 assert.deepEqual(az.alternates.languages,kg.alternates.languages);
 assert.deepEqual(Object.keys(az.alternates.languages),['en-AZ','en-KG','x-default']);
 const xml=sitemapXml('www.geototal.kg',{services:[],projects:[],products:[],blogs:[record]});
 const entry=xml.match(/<url><loc>https:\/\/www.geototal.kg\/en\/blog\/example<\/loc>(.*?)<\/url>/)[1];
 for(const [lang,url] of Object.entries(kg.alternates.languages))assert.ok(entry.includes(`hreflang="${lang}" href="${url}"`));
 assert.ok(!entry.includes('/ky/'));
});
