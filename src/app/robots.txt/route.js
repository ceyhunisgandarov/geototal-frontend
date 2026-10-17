import {headers} from 'next/headers';
import {getRequestHost} from '@/lib/locales';
import {robotsText} from '@/lib/crawl';
export const dynamic='force-dynamic';
export function GET() {
 return new Response(robotsText(getRequestHost(headers())),{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}});
}
