import {contentLoader} from "./helpers/server-content.mjs";
import test from 'node:test';
import assert from 'node:assert/strict';
import {pageMetadata,seoSite,cleanDescription} from '../src/lib/seo.js';
import {localizedText} from '../src/lib/localizedText.js';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
for(const [host,locales] of [['www.geototal.az',['az','en','ru']],['www.geototal.kg',['ky','en','ru']]]) {
 for(const locale of locales)test(`${host}/${locale}: page-specific metadata and matching alternates`,()=>{
  const titles=new Set();
  for(const [page,path] of [['home',''],['services','services'],['projects','projects'],['aboutus','aboutus'],['references','aboutus/references'],['products','products'],['contact','contact']]) {
   const m=pageMetadata({host,locale,page,path});assert.ok(m.description.length>20);assert.ok(!titles.has(m.title));titles.add(m.title);
   assert.equal(m.alternates.canonical,`https://${host}/${locale}${path?'/'+path:''}`);
   assert.deepEqual(Object.keys(m.alternates.languages),[...locales,'x-default']);
   assert.equal(m.alternates.languages['x-default'],`https://${host}/${locales[0]}${path?'/'+path:''}`);
  }
 });
}
test('Canonical origin cannot be supplied by arbitrary host',()=>{
 assert.equal(seoSite('evil.example','en').origin,'https://www.geototal.az');
 assert.equal(seoSite('www.geototal.kg.evil.test','en').origin,'https://www.geototal.az');
 assert.equal(seoSite('WWW.GEOTOTAL.KG.:3000','ru').origin,'https://www.geototal.kg');
});
test('Detail metadata uses record text and preserves same path in every language',()=>{
 const m=pageMetadata({host:'www.geototal.az',locale:'az',page:'services',path:'services/lidar',title:'LiDAR çəkilişi',description:'<p>LiDAR\n xidməti</p>'});
 assert.equal(m.title,'LiDAR çəkilişi | GeoTotal');assert.equal(m.description,'LiDAR xidməti');assert.equal(m.alternates.languages.en,'https://www.geototal.az/en/services/lidar');assert.equal(cleanDescription('a'.repeat(300)).length,300);
});
function server(fetch){
 const source=readFileSync(new URL('../src/lib/server-seo.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'').replaceAll('export function','function').replaceAll('export async function','async function');
 const context={getDetail:contentLoader(fetch).getDetail,fetch,process:{env:{NEXT_PUBLIC_API_BASE_URL:'http://api.test/geototal/'}},AbortSignal,headers:()=>new Headers({host:'www.geototal.az'}),getRequestHost:h=>h.get('host'),pageMetadata,localizedText};
 vm.createContext(context);vm.runInContext(source+'\nthis.detailMetadata=detailMetadata;',context);return context.detailMetadata;
}
test('Service metadata fetches correct record and sorted localized description',async()=>{
 let url;const f=server(async u=>{url=u;return {ok:true,json:async()=>({status:{code:200},response:{serviceName:'LiDAR',serviceParts:[{id:2,serviceTextAz:'second'},{id:1,serviceTextAz:'first'}]}})}});
 const m=await f('az','service','lidar');assert.equal(url,'http://api.test/geototal/user/service/get/lidar');assert.equal(m.description,'first');assert.equal(m.title,'LiDAR | GeoTotal');
});
test('Product and project descriptions match API field names',async()=>{
 const f=server(async()=>({ok:true,json:async()=>({status:{code:200},response:{brand:'Leica',model:'TS',descriptionAz:'Məhsul təsviri',projectName:'Layihə',worksDescription:'Görülən işlər'}})}));
 assert.equal((await f('az','product','7')).description,'Məhsul təsviri');assert.equal((await f('az','project','project')).description,'Görülən işlər');
});
test('API failure is not hidden behind successful detail metadata',async()=>{
 const f=server(async()=>{throw Error('timeout')});await assert.rejects(()=>f('az','service','missing'),/temporarily unavailable/);
});

test('Automatic summaries end at sentence boundaries instead of cutting words',()=>{
 const first='GeoTotal provides accurate surveying services.';
 assert.equal(cleanDescription(first+' '+('Further technical information '.repeat(20))+'.'),first);
 const long='This is '+('a detailed description '.repeat(12))+'.';
 assert.equal(cleanDescription(long),long);
});
test('Explicit SEO description is preserved and whitespace falls back to body',()=>{
 const custom='Complete custom description '.repeat(10).trim()+'.';
 assert.equal(pageMetadata({seoDescription:custom,description:'Body.'}).description,custom);
 assert.equal(pageMetadata({seoDescription:'  ',description:'Body.'}).description,'Body.');
});
for(const locale of ['az','en','ru','ky']) test(`Explicit ${locale} metadata comes from its own field`,async()=>{
 const suffix=locale[0].toUpperCase()+locale.slice(1);
 const f=server(async()=>({ok:true,json:async()=>({status:{code:200},response:{brand:'Device',model:'One',seoDescriptionAz:'AZ only.',['seoDescription'+suffix]:'Selected description.',descriptionAz:'Body text.'}})}));
 assert.equal((await f(locale,'product','7')).description,'Selected description.');
});
