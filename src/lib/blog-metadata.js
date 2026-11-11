import { regionalAlternates, blogLanguages } from "./regional-alternates.js";
import { seoSite, cleanDescription } from "./seo.js";
import { blogLabels } from "./blog-labels.js";
export function blogMetadata(host, locale, record) {
  const site = seoSite(host, locale),
    suffix = { az: "", en: "En", ru: "Ru", ky: "Ky" }[locale] || "";
  const fieldSuffix = locale[0].toUpperCase() + locale.slice(1);
  const labels = blogLabels(locale),
    path = record ? `blog/${encodeURIComponent(record.slug)}` : "blog";
  const title = record
    ? record[`seoTitle${fieldSuffix}`] || record[`title${suffix}`]
    : labels[1];
  const description = record
    ? record[`seoDescription${fieldSuffix}`] ||
      cleanDescription(record[`description${suffix}`])
    : labels[2];
  const url = (l) => `${site.origin}/${l}/${path}`;
  const languages = regionalAlternates(
    path,
    record ? blogLanguages(record) : undefined
  );
  return {
    title: `${(title || labels[1]).replace(
      /\s*\|\s*GeoTotal\s*$/i,
      ""
    )} | GeoTotal`,
    description,
    alternates: { canonical: url(locale), languages },
    openGraph: {
      title,
      description,
      url: url(locale),
      type: record ? "article" : "website",
    },
  };
}
