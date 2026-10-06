import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['az', 'en', 'ru', 'ky'],
 
  // Used when no locale matches
  defaultLocale: 'az'
});