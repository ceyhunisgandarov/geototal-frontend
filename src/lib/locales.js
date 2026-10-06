export const supportedLocales = ["az", "en", "ru", "ky"];
export function resolveLocale(locale, defaultLocale = "az") {
  return supportedLocales.includes(locale) ? locale : defaultLocale;
}
export function switchLocalePath(pathname, locale) {
  const parts = pathname.split("/");
  if (supportedLocales.includes(parts[1])) parts[1] = resolveLocale(locale);
  else parts.splice(1, 0, resolveLocale(locale));
  return parts.join("/");
}
