import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { getDomainLocales, getRequestHost, supportedLocales, switchLocalePath } from './lib/locales';

export default function middleware(request) {
  const domain = getDomainLocales(getRequestHost(request.headers));
  const locale = request.nextUrl.pathname.split('/')[1];
  if (supportedLocales.includes(locale) && !domain.locales.includes(locale)) {
    const url = request.nextUrl.clone();
    url.pathname = switchLocalePath(url.pathname, domain.defaultLocale);
    return NextResponse.redirect(url);
  }

  return createMiddleware({
    ...routing,
    ...domain,
    // Country domains always open in their own default language.
    ...(domain.locales.length < supportedLocales.length ? { localeDetection: false } : {})
  })(request);
}

export const config = {
  matcher: ['/', '/(az|en|ru|ky)/:path*']
};
