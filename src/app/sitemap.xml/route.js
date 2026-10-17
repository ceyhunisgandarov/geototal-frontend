import {headers} from 'next/headers';
import {getRequestHost} from '@/lib/locales';
import {getList} from '@/lib/server-content';
import {sitemapXml} from '@/lib/crawl';
export const dynamic='force-dynamic';
export async function GET() {
 try {
  const [services,projects,products]=await Promise.all([getList('services'),getList('projects'),getList('products')]);
  return new Response(sitemapXml(getRequestHost(headers()),{services,projects,products}),{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'no-store'}});
 } catch {
  // Do not serve an incomplete successful sitemap during an API outage.
  return new Response('Sitemap temporarily unavailable',{status:503,headers:{'Retry-After':'300','Cache-Control':'no-store'}});
 }
}
