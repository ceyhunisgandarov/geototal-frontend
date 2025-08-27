import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

let lastLocale = null; // dışarda bir değişken

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = typeof requestLocale === "string"
        ? requestLocale
        : await requestLocale;

    // Eğer requested undefined ise daha önceki değeri kullan
    const validRequested = requested ?? lastLocale ?? routing.defaultLocale;

    // Eğer validRequested yeni locale ise güncelle
    if (validRequested !== lastLocale) {
        lastLocale = validRequested;
    }

    const locale = hasLocale(routing.locales, validRequested)
        ? validRequested
        : routing.defaultLocale;

    console.log(locale, "locale");

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});
