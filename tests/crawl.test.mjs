import test from 'node:test';
import assert from 'node:assert/strict';
import {sitemapXml,robotsText,publicRedirect} from '../src/lib/crawl.js';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const data={services:[{pathName:'dron-xidmetleri'},{pathName:'dron-xidmetleri'},{pathName:'../admin'},{pathName:null}],projects:[{path:'bridge & road'}],products:[{id:7},{id:-1},{id:'abc'}]};
// List payloads contain full localized records, as required by the API contract.
for (const service of data.services) Object.assign(service, {
 serviceName:'Survey',serviceNameEn:'Survey',serviceNameRu:'Survey',serviceNameKy:'Survey',
 serviceParts:[{serviceTextAz:'Text',serviceTextEn:'Text',serviceTextRu:'Text',serviceTextKy:'Text'}]
});
for (const project of data.projects) Object.assign(project, {
 projectName:'Bridge',projectNameEn:'Bridge',projectNameRu:'Bridge',projectNameKy:'Bridge',
 worksDescription:'Work',worksDescriptionEn:'Work',worksDescriptionRu:'Work',worksDescriptionKy:'Work'
});
for (const product of data.products) Object.assign(product, {
 brand:'Device',descriptionAz:'Text',descriptionEn:'Text',descriptionRu:'Text',descriptionKy:'Text'
});
for(const [host,first,excluded] of [['www.geototal.az','az','ky'],['www.geototal.kg','ky','az']])test(`${host}: sitemap contains only own languages and valid public routes`,()=>{
 const xml=sitemapXml(host,data);const locs=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 const expectedCount=host.endsWith(".kg")?22:33;
 assert.equal(locs.length,expectedCount);assert.equal(new Set(locs).size,expectedCount);
 assert.ok(locs.includes(`https://${host}/${first}/xidmetler/dron-xidmetleri`));
 assert.ok(locs.includes(`https://${host}/ru/layiheler/bridge%20%26%20road`));
 assert.ok(!xml.includes(`https://${host}/${excluded}/`));
 assert.ok(!locs.some(u=>u.includes('/admin')||u.includes('/login')||u.includes('/mehsullar/-1')));
 assert.ok(xml.includes(`hreflang="x-default" href="https://www.geototal.az/az/xidmetler/dron-xidmetleri"`));
 assert.ok(!xml.includes('lastmod'));
 assert.ok(robotsText(host).includes(`Sitemap: https://${host}/sitemap.xml`));
});
test('Empty data retains public static pages without fabricated details',()=>{
 const xml=sitemapXml('www.geototal.az',{services:[],projects:[],products:[]});assert.equal([...xml.matchAll(/<loc>/g)].length,24);
});
for(const [host,protocol,path,expected] of [
 ['geototal.az','http','/xidmetler/dron-xidmetleri','https://www.geototal.az/az/xidmetler/dron-xidmetleri'],
 ['geototal.kg','https','/layiheler/bridge','https://www.geototal.kg/ky/layiheler/bridge'],
 ['www.geototal.az','http','/en/xidmetler/dron-xidmetleri','https://www.geototal.az/en/xidmetler/dron-xidmetleri'],
 ['www.geototal.kg','https','/','https://www.geototal.kg/ky'],
 ['localhost:3000','http','/xidmetler/dron-xidmetleri','/az/xidmetler/dron-xidmetleri']
])test(`Permanent destination: ${host}${path}`,()=>{
 assert.equal(publicRedirect({host,protocol,pathname:path,search:'?q=1'}),expected+'?q=1');
});
test('Canonical requests have no redirect loops and localhost stays local',()=>{
 for(const [host,protocol,pathname] of [['www.geototal.az','https','/az/xidmetler'],['www.geototal.kg','https','/robots.txt'],['localhost:3000','http','/az/xidmetler'],['evil.example','https','/az']])assert.equal(publicRedirect({host,protocol,pathname}),null);
});
function sitemapRoute(getList){
 const s=readFileSync(new URL('../src/app/sitemap.xml/route.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'').replace('export const','const').replace('export async function','async function');
 const context={getList,sitemapXml,headers:()=>new Headers({host:'www.geototal.kg'}),getRequestHost:h=>h.get('host'),Response};vm.createContext(context);vm.runInContext(s+'\nthis.GET=GET;',context);return context.GET;
}
test('Sitemap route serves domain-specific XML with no shared cache',async()=>{
 const r=await sitemapRoute(async key=>data[key])();assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/application\/xml/);assert.equal(r.headers.get('cache-control'),'no-store');assert.ok((await r.text()).includes('https://www.geototal.kg/ky'));
});
test('API outage returns 503 instead of a truncated successful sitemap',async()=>{
 const r=await sitemapRoute(async()=>{throw Error('unavailable')})();assert.equal(r.status,503);assert.equal(r.headers.get('retry-after'),'300');assert.ok(!(await r.text()).includes('<urlset'));
});
