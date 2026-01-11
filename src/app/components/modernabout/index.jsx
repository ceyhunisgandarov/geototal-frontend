"use client";
import Link from "next/link";
import styles from "../../../../public/assets/css/module/modern/about.module.css";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Image from "next/image";
import AboutService from "@/app/services/AboutService";

export default function AboutSection() {
  const t = useTranslations("AboutUs");

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  let contentTitle = "";
  let text = "";

  if (content) {
    switch (t("locale")) {
      case "az":
        contentTitle = content.title;
        text = content.description;
        break;
      case "en":
        contentTitle = content.titleEn;
        text = content.descriptionEn;
        break;
      case "ru":
        contentTitle = content.titleRu;
        text = content.descriptionRu;
        break;
      default:
        contentTitle = "error";
        text = "error";
    }
  }
  useEffect(() => {
    AboutService.getAboutInfo("first")
      .then((response) => {
        if (response.data.status.code === 200) {
          setContent(response.data.response);
        } else {
          console.log("something went wrong-", response.data.status.message);
        }
      })
      .catch((error) => {
        console.log("something went wrong-", error);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 100); // smooth geçiş
      });
  }, []); // <-- boş array ekledik

  return (
    <section className={styles.aboutArea}>
      {loading ? (
        <section
          className={`${styles.aboutSection} ${loading ? styles.skeleton : ""}`}
        >
          <div className={styles.imageWrapper}>
            <div className={styles.skeletonImage}></div>
          </div>

          <div className={styles.aboutText}>
            <div className={`${styles.skeletonText} ${styles.short}`}></div>
            <div className={`${styles.skeletonText} ${styles.medium}`}></div>
            <div className={`${styles.skeletonText} ${styles.long}`}></div>
          </div>
        </section>
      ) : (
        <div className={styles.container}>
          <div className={styles.row}>
            {/* Image */}
            <div className={styles.colImage}>
              <div className={styles.aboutImage}>
                <Image
                  src={content.imageUrl}
                  alt="About Koffee Shop"
                  width={600}
                  height={600}
                  className={styles.image}
                />
              </div>
            </div>

            {/* Content */}
            <div className={styles.colContent}>
              <div className={styles.aboutText}>
                <h3>{contentTitle}</h3>

                <p>{text}</p>

                <Link
                  href={`${t("locale")}/aboutus`}
                  className={styles.defaultBtn}
                >
                  {t("more")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
