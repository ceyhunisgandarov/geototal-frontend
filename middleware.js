import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';

const handleI18nRouting = createMiddleware(routing);

const ALL_LOCALES = ['az', 'en', 'ru', 'ky'];

export default function middleware(request) {
  // Port varsa kaldırır: localhost:3000 vb.
  const host = (request.headers.get('host') || '')
    .split(':')[0]
    .toLowerCase();

  const pathname = request.nextUrl.pathname;

  let allowedLocales = ALL_LOCALES;
  let defaultLocale = 'en';

  // .az domain
  if (host.endsWith('.az')) {
    allowedLocales = ['az', 'en', 'ru'];
    defaultLocale = 'az';
  }

  // .kg domain
  else if (host.endsWith('.kg')) {
    allowedLocales = ['ky', 'ru'];
    defaultLocale = 'ky';
  }

  // URL'deki dili bul
  // Örn: /az/products -> az
  const pathnameLocale = pathname.split('/')[1];

  // Domain için yasak bir locale açılmışsa
  if (
    ALL_LOCALES.includes(pathnameLocale) &&
    !allowedLocales.includes(pathnameLocale)
  ) {
    const url = request.nextUrl.clone();

    const restOfPath =
      pathname.replace(`/${pathnameLocale}`, '') || '/';

    url.pathname =
      restOfPath === '/'
        ? `/${defaultLocale}`
        : `/${defaultLocale}${restOfPath}`;

    return Response.redirect(url);
  }

  // Normal next-intl işlemi
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    '/',
    '/(az|en|ru|ky)/:path*'
  ]
};