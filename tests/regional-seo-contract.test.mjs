import test from 'node:test';
import assert from 'node:assert/strict';
import {pageMetadata,seoSite} from '../src/lib/seo.js';
import {regionalAlternates,contentLanguages} from '../src/lib/regional-alternates.js';
import {regionalHomeCopy,regionalServiceCopy} from '../src/lib/regional-content.js';
import {getDomainLocales,getRequestHost} from '../src/lib/locales.js';
import {publicRedirect,sitemapXml} from '../src/lib/crawl.js';
const service={pathName:'geodesy-and-topography',serviceName:'Ölçmə',serviceNameEn:'Surveying',serviceParts:[{serviceTextAz:'Mətn',serviceTextEn:'Text',serviceTextRu:' '} ]};
const project={path:'bridge',projectName:'Körpü',worksDescription:'Mətn',projectNameRu:'Мост',worksDescriptionRu:'Текст'};
const product={id:7,brand:'Geo',model:'One',descriptionEn:'Details',descriptionKy:'Маалымат'};
const dataset={services:[service],projects:[project],products:[product]};
for(const [host,locales,region] of [['www.geototal.az',['az','en','ru'],'AZ'],['www.geototal.kg',['ky','ru'],'KG']]) {
 for(const locale of locales) for(const [page,path] of [['home',''],['services','services/geodesy-and-topography'],['projects','projects/bridge'],['products','products/7']]) test(`${host}/${locale} ${page}: canonical and reciprocal alternates`,()=>{
  const meta=pageMetadata({host,locale,page,path});
  assert.equal(new URL(meta.alternates.canonical).host,host);
  assert.equal(meta.alternates.canonical,meta.alternates.languages[`${locale}-${region}`]);
  const url=new URL(meta.alternates.canonical);
  assert.equal(publicRedirect({host,protocol:'https',pathname:url.pathname}),null);
  assert.deepEqual(meta.alternates.languages,regionalAlternates(path));
 });
 test(`${host}: sitemap only advertises translated canonical destinations`,()=>{
  const xml=sitemapXml(host,dataset);
  for(const [entry] of xml.matchAll(/<url>.*?<\/url>/g)) {
   const loc=entry.match(/<loc>(.*?)<\/loc>/)[1],url=new URL(loc);
   assert.equal(url.host,host);
   assert.equal(publicRedirect({host,protocol:'https',pathname:url.pathname}),null);
  }
  assert.ok(!xml.includes('/services/'));
  assert.ok(!xml.includes('hreflang="ru-AZ" href="https://www.geototal.az/ru/xidmetler/geodeziya-topoqrafiya-xidmetleri"'));
  for(const [kind,record,path] of [['service',service,'xidmetler/geodeziya-topoqrafiya-xidmetleri'],['project',project,'layiheler/bridge'],['product',product,'mehsullar/7']]) {
   const available=contentLanguages(kind,record);
   for(const locale of locales) {
    const meta=pageMetadata({host,locale,path,availableLanguages:available});
    assert.equal(xml.includes(`<loc>${meta.alternates.canonical}</loc>`),available.includes(locale));
    if(!available.includes(locale)) assert.equal(meta.robots.index,false);
    else for(const [tag,href] of Object.entries(meta.alternates.languages)) assert.ok(xml.includes(`hreflang="${tag}" href="${href}"`));
   }
  }
 });
}
test('Complete text is required; display fallbacks do not create hreflang translations',()=>{
 assert.deepEqual(contentLanguages('service',service),['az','en']);
 assert.deepEqual(contentLanguages('project',project),['az','ru']);
 assert.deepEqual(contentLanguages('product',product),['en','ky']);
 assert.deepEqual(contentLanguages('service',{...service,serviceParts:[...service.serviceParts,{serviceTextAz:'Mətn'}]}),['az']);
 assert.deepEqual(regionalAlternates('services/lidar',[]),{});
});
test('Only exact hosts select a region, including normalized forwarded hosts',()=>{
 for(const host of ['evil.kg','geototal.kg.evil.com','https://geototal.kg','geototal.kg/path','geototal.kg@evil.com','geototal.kg\\evil']) {
  assert.equal(seoSite(host,'en').origin,'https://www.geototal.az');
  assert.equal(getDomainLocales(host).locales.length,4);
 }
 assert.equal(seoSite('WWW.GEOTOTAL.KG.:443').origin,'https://www.geototal.kg');
 assert.equal(getRequestHost(new Headers({host:'www.geototal.az','x-forwarded-host':'evil.kg'})),'www.geototal.az');
 assert.equal(seoSite(getRequestHost(new Headers({host:'localhost:3000','x-forwarded-host':'www.geototal.kg'}))).origin,'https://www.geototal.kg');
});
test('EN/RU region context differs and custom CMS SEO is preserved',()=>{
 for(const locale of ['en','ru']) {
  const az=pageMetadata({host:'www.geototal.az',locale}),kg=pageMetadata({host:'www.geototal.kg',locale});
  assert.notEqual(az.title,kg.title);assert.notEqual(az.description,kg.description);
  assert.notEqual(regionalHomeCopy('AZ',locale).intro,regionalHomeCopy('KG',locale).intro);
  assert.notEqual(regionalServiceCopy('AZ',locale,'Survey').title,regionalServiceCopy('KG',locale,'Survey').title);
  const custom=pageMetadata({host:'www.geototal.kg',locale,page:'services',path:'services/lidar',title:'Custom title',seoDescription:'Custom description.',preserveTitle:true});
  assert.equal(custom.title,'Custom title | GeoTotal');assert.equal(custom.description,'Custom description.');
 }
 assert.equal(pageMetadata({host:'www.geototal.az',locale:'en'}).title,'Geodesy and Topographic Surveying Services in Azerbaijan | GeoTotal');
});
test('Old links preserve queries, reach final destination in one hop and leave API routes alone',()=>{
 for(const host of ['www.geototal.az','www.geototal.kg']) {
  const result=publicRedirect({host,protocol:'https',pathname:'/en/services/geodesy-and-topography',search:'?source=link'});
  const url=new URL(result,`https://${host}`);
  assert.equal(url.pathname,'/en/xidmetler/geodeziya-topoqrafiya-xidmetleri');assert.equal(url.search,'?source=link');
  assert.equal(url.host,host.endsWith('.kg')?'www.geototal.az':host);
  assert.equal(publicRedirect({host:url.host,protocol:'https',pathname:url.pathname,search:url.search}),null);
  assert.equal(publicRedirect({host,protocol:'https',pathname:'/api/services/test'}),null);
 }
});
