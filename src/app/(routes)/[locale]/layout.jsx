import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../../../../public/assets/css/reset.css";
import "../../../../public/assets/css/global.css";
import Script from "next/script";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "Main Page - Geototal"
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html>
      <body>
        <Script
          src="//code.jivosite.com/widget/efpa9Si5gR"
          strategy="afterInteractive"
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
