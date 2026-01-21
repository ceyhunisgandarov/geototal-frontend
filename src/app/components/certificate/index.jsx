"use client";
import { useTranslations } from "next-intl";
import styles from "../../../../public/assets/css/module/aboutussection/certificate.module.css";
import { useEffect, useState } from "react";
import CertificateService from "@/app/services/CertificateService";
import Image from "next/image";

export default function CertificateSection() {
  const [certificates, setCertificates] = useState([]);
  const t = useTranslations("Navbar");

  useEffect(() => {
    refreshCertificates();
  }, []);

  const refreshCertificates = () => {
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
      });
  };

  return (
    <div className={styles.page}>
      <h3>{t("certificates")}</h3>
      <div className={styles.grid}>
        {certificates.map((cert) => (
          <div key={cert.id} className={styles.certificateWrapper}>
            <div className={styles.imageWrapper}>
              <Image src={cert.imageUrl} alt={cert.title} width={300} height={300}  className={styles.image}/>
            </div>
            <p className={styles.name}>{cert.description}</p>
          </div>
        ))}
      </div>
      <button>{t("more")}</button>
    </div>
  );
}
