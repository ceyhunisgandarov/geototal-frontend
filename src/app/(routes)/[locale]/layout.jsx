//app/(routes)/[locale]/layout.jsx
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../../../../public/assets/css/reset.css";
import "../../../../public/assets/css/global.css";
import Script from "next/script";

import WhatsappButton from "@/app/components/whatsapp";

export function generateMetadata({ params }) {
  return { title: `${params.locale === "ky" ? "Башкы бет" : "Main Page"} - Geototal` };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
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
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <WhatsappButton />
      </body>
    </html>
  );
}
