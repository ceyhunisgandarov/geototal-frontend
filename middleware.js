// import createMiddleware from 'next-intl/middleware';
// import { routing } from './src/i18n/routing';

// export default createMiddleware(routing);

// export const config = {
//   matcher: ['/', '/(az|en|ru|ky)/:path*']
// };

import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Varsayılan: tüm diller
  let allowedLocales = ["az", "en", "ru", "ky"];
  let defaultLocale = "en";

  if (host.endsWith(".az")) {
    allowedLocales = ["az", "en", "ru"];
    defaultLocale = "az";
  } else if (host.endsWith(".kg")) {
    allowedLocales = ["ky", "ru"];
    defaultLocale = "ky";
  }

  // URL'deki locale'i al
  const locale = pathname.split("/")[1];

  // Eğer locale varsa ama bu domain için izinli değilse yönlendir
  if (
    ["az", "en", "ru", "ky"].includes(locale) &&
    !allowedLocales.includes(locale)
  ) {
    const newPath = pathname.replace(`/${locale}`, `/${defaultLocale}`);
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(az|en|ru|ky)/:path*"],
};
