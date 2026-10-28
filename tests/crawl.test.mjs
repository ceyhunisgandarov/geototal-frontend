import test from 'node:test';
import assert from 'node:assert/strict';
import {sitemapXml,robotsText,publicRedirect} from '../src/lib/crawl.js';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const data={services:[{pathName:'lidar'},{pathName:'lidar'},{pathName:'../admin'},{pathName:null}],projects:[{path:'bridge & road'}],products:[{id:7},{id:-1},{id:'abc'}]};
for(const [host,first,excluded] of [['www.geototal.az','az','ky'],['www.geototal.kg','ky','az']])test(`${host}: sitemap contains only own languages and valid public routes`,()=>{
 const xml=sitemapXml(host,data);const locs=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 assert.equal(locs.length,33);assert.equal(new Set(locs).size,33);
 assert.ok(locs.includes(`https://${host}/${first}/services/lidar`));
 assert.ok(locs.includes(`https://${host}/en/projects/bridge%20%26%20road`));
 assert.ok(!xml.includes(`https://${host}/${excluded}/`));
 assert.ok(!locs.some(u=>u.includes('/admin')||u.includes('/login')||u.includes('/products/-1')));
 assert.ok(xml.includes(`hreflang="x-default" href="https://${host}/${first}/services/lidar"`));
 assert.ok(!xml.includes('lastmod'));
 assert.ok(robotsText(host).includes(`Sitemap: https://${host}/sitemap.xml`));
});
test('Empty data retains public static pages without fabricated details',()=>{
 const xml=sitemapXml('www.geototal.az',{services:[],projects:[],products:[]});assert.equal([...xml.matchAll(/<loc>/g)].length,24);
});
for(const [host,protocol,path,expected] of [
 ['geototal.az','http','/services/lidar','https://www.geototal.az/az/services/lidar'],
 ['geototal.kg','https','/projects/bridge','https://www.geototal.kg/ky/projects/bridge'],
 ['www.geototal.az','http','/en/services/lidar','https://www.geototal.az/en/services/lidar'],
 ['www.geototal.kg','https','/','https://www.geototal.kg/ky'],
 ['localhost:3000','http','/services/lidar','/az/services/lidar']
])test(`Permanent destination: ${host}${path}`,()=>{
 assert.equal(publicRedirect({host,protocol,pathname:path,search:'?q=1'}),expected+'?q=1');
});
test('Canonical requests have no redirect loops and localhost stays local',()=>{
 for(const [host,protocol,pathname] of [['www.geototal.az','https','/az/services'],['www.geototal.kg','https','/robots.txt'],['localhost:3000','http','/az/services'],['evil.example','https','/az']])assert.equal(publicRedirect({host,protocol,pathname}),null);
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
