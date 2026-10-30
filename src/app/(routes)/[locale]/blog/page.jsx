import Link from "next/link";
import { headers } from "next/headers";
import Layout from "@/app/components/layout";
import { getList } from "@/lib/server-content";
import { getRequestHost } from "@/lib/locales";
import { blogMetadata } from "@/lib/blog-metadata";
import { blogLabels } from "@/lib/blog-labels";
import styles from "@/app/components/blog/blog.module.css";
export function generateMetadata({ params }) {
  return blogMetadata(getRequestHost(headers()), params.locale);
}
export default async function BlogPage({ params: { locale } }) {
  const labels = blogLabels(locale),
    suffix = { az: "", en: "En", ru: "Ru", ky: "Ky" }[locale];
  const rows = (await getList("blogs")).filter(
    (b) =>
      b.published === true &&
      b[`title${suffix}`]?.trim() &&
      b[`description${suffix}`]?.trim()
  );
  return (
    <Layout page="blog" locale={locale}>
      <section className={styles.page}>
        <h1>{labels[1]}</h1>
        <p>{labels[2]}</p>
        <div className={styles.cards}>
          {rows.map((b) => (
            <article className={styles.card} key={b.id}>
              <h2 className={styles.cardTitle}>
                <Link href={`/${locale}/blog/${encodeURIComponent(b.slug)}`}>
                  {b[`title${suffix}`]}
                </Link>
              </h2>

              {b.imagePath && (
                <Link
                  href={`/${locale}/blog/${encodeURIComponent(b.slug)}`}
                  className={styles.imageLink}
                >
                  <img
                    src={b.imagePath}
                    alt={b[`title${suffix}`]}
                    className={styles.cardImage}
                    loading="lazy"
                  />
                </Link>
              )}

              <Link
                className={styles.readMore}
                href={`/${locale}/blog/${encodeURIComponent(b.slug)}`}
              >
                {labels[6]} →
              </Link>
            </article>
          ))}
        </div>
        {!rows.length && <p>{labels[3]}</p>}
      </section>
    </Layout>
  );
}
