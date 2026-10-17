// Internal paths follow the current language; only HTTP(S) external links are allowed.
export function carouselHref(value, locale) {
  if (typeof value !== "string" || !value.trim()) return null;
  const link = value.trim();
  if (/^[\u0000-\u001f]|[\\\u0000-\u001f]/.test(link) || link.startsWith("//")) return null;
  if (/^https?:\/\//i.test(link)) {
    try { const url = new URL(link); return url.hostname ? url.href : null; } catch { return null; }
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(link)) return null;
  const path = link.replace(/^\//, "").replace(/^(az|en|ru|ky)(?=\/|$)/, "").replace(/^\//, "");
  return `/${locale}/${path}`;
}
