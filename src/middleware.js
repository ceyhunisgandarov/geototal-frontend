import {publicRedirect} from './lib/crawl';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { getDomainLocales, getRequestHost, supportedLocales, switchLocalePath } from './lib/locales';

export default function middleware(request) {
  const host=getRequestHost(request.headers);
  const protocol=(request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':','')).split(',')[0].trim();
  const redirect=publicRedirect({host,protocol,pathname:request.nextUrl.pathname,search:request.nextUrl.search});
  if(redirect)return NextResponse.redirect(new URL(redirect,request.url),308);
  if(['/robots.txt','/sitemap.xml'].includes(request.nextUrl.pathname))return NextResponse.next();
  const domain = getDomainLocales(host);
  const locale = request.nextUrl.pathname.split('/')[1];
  if (supportedLocales.includes(locale) && !domain.locales.includes(locale)) {
    const url = request.nextUrl.clone();
    url.pathname = switchLocalePath(url.pathname, domain.defaultLocale);
    return NextResponse.redirect(url);
  }

  return createMiddleware({
    ...routing,
    ...domain,
    alternateLinks: false, // Metadata supplies canonical language URLs, including a working x-default.
    // Country domains always open in their own default language.
    ...(domain.locales.length < supportedLocales.length ? { localeDetection: false } : {})
  })(request);
}

export const config = {
  matcher: ['/', '/(az|en|ru|ky)/:path*', '/services/:path*', '/projects/:path*', '/products/:path*', '/aboutus/:path*', '/contact/:path*', '/robots.txt', '/sitemap.xml']
};
