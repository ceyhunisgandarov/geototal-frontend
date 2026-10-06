"use client";
import { localizedText } from "@/lib/localizedText";
import { useLocale } from "next-intl";
import Link from "next/link";
import styles from "../../../../public/assets/css/module/newbanner/banner.module.css";

export default function Banner({ carousel, t, active }) {
  const locale = useLocale();
  const imageUrl = carousel?.imageLink
    ? carousel.imageLink
    : "/images/drone-works.jpeg";

  return (
    <section
      className={`${styles.banner} ${active ? styles.active : ""}`}
      style={{
        backgroundImage: `url('${imageUrl}')`,
      }}
    >
      {carousel.id !== 1 && (
        <div className={styles.blurStripe}>
          <h1 className={`${styles.title} ${active ? styles.active : ""}`}>
            {localizedText(carousel, "title", locale)}
          </h1>
          <p className={`${styles.subtitle} ${active ? styles.active : ""}`}>
            {localizedText(carousel, "description", locale)}
          </p>
          <Link
            href={`/${t("locale")}/${carousel.link}`}
            className={`${styles.btnMore} ${active ? styles.active : ""}`}
          >
            {t("more")}
          </Link>
        </div>
      )}
      <div className={styles.overlay}></div>
    </section>
  );
}
