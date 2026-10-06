import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { resolveLocale } from '../lib/locales';

export default getRequestConfig(async ({ requestLocale }) => {
    const locale = resolveLocale(await requestLocale, routing.defaultLocale);
    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});
