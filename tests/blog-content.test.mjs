import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import Markdown from 'react-markdown';
import {sitemapXml} from '../src/lib/crawl.js';import {blogMetadata} from '../src/lib/blog-metadata.js';
const root=new URL('../content/prepared/2026-10-28/',import.meta.url),manifest=JSON.parse(readFileSync(new URL('manifest.json',root))),suffixes={az:'',en:'En',ru:'Ru',ky:'Ky'};
test('Prepared content has 80 complete localized versions and assets',()=>{
 assert.equal(manifest.files.length,20);
 for(const file of manifest.files){
  const p=JSON.parse(readFileSync(new URL(file,root))),r=p.request;
  assert.deepEqual(p.languages,['az','en','ru','ky']);
  for(const [lang,s] of Object.entries(suffixes)){
   const title=r[(p.type==='blog'?'title':p.type==='project'?'projectName':'serviceName')+s];assert.ok(title?.trim(),file+' '+lang);
   assert.ok(r['seoTitle'+lang[0].toUpperCase()+lang.slice(1)]?.trim());assert.ok(r['seoDescription'+lang[0].toUpperCase()+lang.slice(1)]?.trim());
   if(p.type==='blog'){
    assert.equal(r.published,false);const body=r['description'+s];assert.ok(body.length>3000);
    const images=[...body.matchAll(/!\[[^\]]*\]\((\/images\/[^)]+)\)/g)];assert.equal(images.length,p.path.includes('suni')?5:3);
    for(const image of images)assert.ok(existsSync(new URL('../public'+image[1],import.meta.url)),image[1]);
   }else if(p.type==='project'){assert.ok(r['worksDescription'+s].length>200);assert.ok(!/<h1\b/i.test(r['worksDescription'+s]));}
   else for(const part of p.parts){assert.ok(part['partName'+s]?.trim());assert.ok(part['serviceText'+lang[0].toUpperCase()+lang.slice(1)].length>80);}
  }
 }
});
test('Only published translated blog URLs enter sitemap and metadata alternates',()=>{
 const blogs=[{slug:'ready',published:true,title:'AZ',description:'AZ',titleEn:'EN',descriptionEn:'EN'},{slug:'draft',published:false,title:'Draft',description:'Draft'}];
 const xml=sitemapXml('www.geototal.az',{services:[],projects:[],products:[],blogs});assert.ok(xml.includes('/az/blog/ready'));assert.ok(xml.includes('/en/blog/ready'));assert.ok(!xml.includes('/ru/blog/ready'));assert.ok(!xml.includes('/blog/draft'));
 const m=blogMetadata('www.geototal.az','az',blogs[0]);assert.equal(m.alternates.canonical,'https://www.geototal.az/az/blog/ready');assert.equal(m.alternates.languages.ru,undefined);
});
test('Article Markdown escapes raw HTML and unsafe link schemes',()=>{
 const html=renderToStaticMarkup(React.createElement(Markdown,{skipHtml:true},'<script>alert(1)</script>\n\n[bad](javascript:alert%281%29)\n\n## Heading'));
 assert.ok(!html.includes('<script'));assert.ok(!html.includes('href="javascript:'));assert.ok(html.includes('<h2>Heading</h2>'));
});
