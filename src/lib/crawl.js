import {normalizedHost,hostRegion} from "./site-host.js";
import {regionalAlternates,blogLanguages,contentLanguages,contentRegionalLanguages} from './regional-alternates.js';
import {publicPath,publicRouteNames} from './public-routes.js';
import {seoSite} from './seo.js';

export const publicPaths=['','services','projects','products','aboutus','aboutus/references','contact','blog'].map(publicPath);
const escapeXml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function segment(value) {
 if(typeof value!=='string' || !value.trim() || value!==value.trim() || ['.','..'].includes(value) || /[\/\\?#\u0000-\u001f]/.test(value))return null;
 return encodeURIComponent(value);
}
export function sitemapXml(host,{services,projects,products,blogs=[]}) {
 const site=seoSite(host);
 const paths=new Map(publicPaths.map(path=>[path,['az','en','ru','ky']]));
 for(const [rows,prefix,key,kind] of [[services,'services','pathName','service'],[projects,'projects','path','project']]) {
  for(const row of rows){const slug=segment(row[key]);if(slug)paths.set(publicPath(`${prefix}/${slug}`),contentRegionalLanguages(kind,row));}
 }
 for(const product of products){const id=String(product.id);if(/^[1-9][0-9]*$/.test(id) && BigInt(id)<=9223372036854775807n)paths.set(`mehsullar/${id}`,contentLanguages('product',product));}
 const entries=[];
 for(const [path,available] of paths){
  const url=locale=>`${site.origin}/${locale}${path?'/'+path:''}`;
  const alternates=Object.entries(regionalAlternates(path,available));
  for(const locale of site.locales.filter(l=>available.includes(l) || available.includes(`${l}-${site.origin.endsWith('.kg') ? 'KG' : 'AZ'}`)))entries.push(`<url><loc>${escapeXml(url(locale))}</loc>${alternates.map(([lang,href])=>`<xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(href)}"/>`).join('')}</url>`);
 }
 for(const blog of blogs) {
  const slug=segment(blog.slug);if(!slug || blog.published!==true)continue;
  const languages=site.locales.filter(l=>{const suffix={az:'',en:'En',ru:'Ru',ky:'Ky'}[l];return blog[`title${suffix}`]?.trim() && blog[`description${suffix}`]?.trim();});
  const url=l=>`${site.origin}/${l}/blog/${slug}`;
  const alternates=Object.entries(regionalAlternates(`blog/${slug}`,blogLanguages(blog)));
  for(const l of languages)entries.push(`<url><loc>${escapeXml(url(l))}</loc>${alternates.map(([lang,href])=>`<xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(href)}"/>`).join('')}</url>`);
 }
 if(entries.length>50000)throw new Error("Sitemap must be split before exceeding 50000 URLs");
 return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`;
}
export function robotsText(host) {
 // Let crawlers read the existing noindex on private pages; no private URLs are published here.
 return `User-agent: *\nAllow: /\n\nSitemap: ${seoSite(host).origin}/sitemap.xml\n`;
}
export function publicRedirect({host,protocol,pathname,search=''}) {
 const hostname=normalizedHost(host);
 const known=Boolean(hostRegion(host));
 const site=seoSite(host);let path=publicPath(pathname);
 const first=path.split('/')[1];
 const unprefixed=[...Object.values(publicRouteNames),'blog'].includes(first);
 if(unprefixed)path=`/${site.defaultLocale}${path}`;
 // Country roots have a stable default; localhost retains next-intl's development behavior.
 if(known && path==='/')path=`/${site.defaultLocale}`;
 if(known && (hostname!==new URL(site.origin).hostname || protocol!=='https' || path!==pathname))return `${site.origin}${path}${search}`;
 if(!known && path!==pathname)return `${path}${search}`;
 return null;
}
