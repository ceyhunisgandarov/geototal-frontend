"use client";
import Link from "next/link";
import styles from "../../../../public/assets/css/module/newbanner/banner.module.css";

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;

export default function Banner({ carousel, t, active }) {
  console.log(carousel.id + "," + active);
  const imageUrl = carousel?.imageLink
    ? `${BASE_IMAGE_URL || ""}${carousel.imageLink}`
    : "/images/drone-works.jpeg";

  return (
    <section
      className={`${styles.banner} ${active ? styles.active : ""}`}
      style={{
        backgroundImage: `url('${imageUrl}')`,
      }}
    >
      <div className={styles.blurStripe}>
        <h1 className={`${styles.title} ${active ? styles.active : ""}`}>
          {carousel.title}
        </h1>
        <p className={`${styles.subtitle} ${active ? styles.active : ""}`}>
          {carousel.description ?? ""}
        </p>
        <Link href={`/${t('locale')}/${carousel.link}`} className={`${styles.btnMore} ${active ? styles.active : ""}`}>
          {t("more")}
        </Link>
      </div>
      <div className={styles.overlay}></div>
    </section>
  );
}
