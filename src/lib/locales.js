import {hostRegion} from "./site-host.js";
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

// Use the same host policy for redirects and server-rendered language menus.
export function getDomainLocales(host = "") {
  const region = hostRegion(host);
  if (region === 'AZ') return { locales: ["az", "en", "ru"], defaultLocale: "az" };
  if (region === 'KG') return { locales: ["ky", "en", "ru"], defaultLocale: "ky" };
  return { locales: supportedLocales, defaultLocale: "az" };
}

export function getRequestHost(headers) {
  const forwarded = headers.get("x-forwarded-host");
  return hostRegion(forwarded) ? forwarded : headers.get("host") || "";
}
