"use client";
import { useTranslations } from "next-intl";
import styles from "../../../../public/assets/css/module/aboutussection/certificate.module.css";
import { useEffect, useState } from "react";
import CertificateService from "@/app/services/CertificateService";
import ImageLightbox from "../lightbox";

export default function CertificateSection() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Navbar");

  useEffect(() => {
    CertificateService.getCertificateList()
      .then((response) => {
        if (response.data.status.code === 200) {
          setCertificates(response.data.response);
        } else {
          console.log("Something went wrong: ", response.data.status.message);
        }
      })
      .catch((error) => {
        console.log("Server error: ", error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <h3>{t("references")}</h3>

      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={styles.certificateWrapper}
                aria-hidden="true"
              >
                <div
                  className={`${styles.imageWrapper} ${styles.skeletonImageWrapper}`}
                >
                  <div className={styles.skeletonShimmer} />
                </div>
                <div className={styles.skeletonName} />
              </div>
            ))
          : certificates.map((cert) => (
              <div key={cert.id} className={styles.certificateWrapper}>
                <p className={styles.name}>{cert.description}</p>
                <div className={styles.imageWrapper}>
                  <ImageLightbox src={cert.imageUrl} style={styles.image} />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
