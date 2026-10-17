"use client";
import Link from "next/link";
import {contentLabels,partHeading} from "@/lib/content-labels";
import { localizedText } from "@/lib/localizedText";
import { useEffect, useState } from "react";
import style from "../../../../../public/assets/css/module/service/servicepage.module.css";
import ServicesService from "@/app/services/ServicesService";
import { useLocale } from "next-intl";

export default function ServicesSection({ service, initialData }) {
  const [error, setError] = useState("");
  const [aService, setAService] = useState(initialData ?? null);
  const [loading, setLoading] = useState(initialData === undefined);
  const locale = useLocale();

  useEffect(() => {
    if(initialData !== undefined) {setAService(initialData); return;}
    refreshService();
  }, [initialData]);

  const refreshService = async () => {
    try {
      const response = await ServicesService.getService(service);
      if (response.data.status.code === 200) {
        setAService(response.data.response);
      } else {
        setError(response.data.status.code === 404 ? "Xidmət tapılmadı." : "Xidmət yüklənmədi.");
      }
    } catch (error) {
      setError("Xidmət yüklənmədi. Yenidən cəhd edin.");
    } finally {
      setLoading(false);
    }
  };

  if (!loading && error) return <p role="alert">{error}</p>;

  // ✅ Skeleton (minimum 2 part)
  if (loading || !aService || !aService.serviceParts) {
    return (
      <div className={style.wrapper}>
        <div className={style.skelTitle} />

        {[0, 1].map((i) => {
          const sectionClass = i % 2 === 0 ? style.dark : style.gray;
          return (
            <div key={i} className={`${sectionClass} ${style.skelBlock}`}>
              <section
                className={`${style.section} ${i % 2 !== 0 ? style.reverse : ""}`}
              >
                <div className={style.left}>
                  <div className={style.skelH3} />
                  <div className={style.skelLine} />
                  <div className={style.skelLine} />
                  <div className={style.skelLineShort} />
                </div>

                <div className={style.right}>
                  <div className={style.skelImage} />
                </div>
              </section>
            </div>
          );
        })}
      </div>
    );
  }

  const labels=contentLabels(locale);
  const serviceName = localizedText(aService, "serviceName", locale);

  const sortedParts = [...aService.serviceParts].sort((a, b) => {
    if (!a.id) return 1;
    if (!b.id) return -1;
    return a.id - b.id;
  });

  return (
    <div className={style.wrapper}>
      <h1>{serviceName}</h1>

      {sortedParts.map((part, index) => {
        if (!part) return null;

        const heading=partHeading(localizedText(part,"partName",locale),serviceName,locale,index);
        const partText = localizedText(part, "serviceText", locale, "serviceTextAz");
        const imageSrc = part.serviceImageUrl || "/placeholder.png";
        const sectionClass = index % 2 === 0 ? style.dark : style.gray;

        return (
          <div key={part.id || index} className={sectionClass}>
            <section
              className={`${style.section} ${
                index % 2 !== 0 ? style.reverse : ""
              }`}
            >
              <div className={style.left}>
                <h2>{heading}</h2>
                <p>{partText}</p>
              </div>
              <div className={style.right}>
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={heading}
                    className={style.image}
                  />
                ) : null}
              </div>
            </section>
          </div>
        );
      })}
      <section className={style.inquiry}>
        <h2>{labels.inquiry}</h2>
        <p>{labels.inquiryText}</p>
        <nav className={style.inquiryLinks}>
          <Link href={`/${locale}#service-inquiry`}>{labels.request}</Link>
          <Link href={`/${locale}/services`}>{labels.allServices}</Link>
        </nav>
      </section>
    </div>
  );
}
