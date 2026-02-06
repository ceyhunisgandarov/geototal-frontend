"use client";
import { useEffect, useState } from "react";
import style from "../../../../../public/assets/css/module/service/servicepage.module.css";
import ServicesService from "@/app/services/ServicesService";
import { useLocale } from "next-intl";

export default function ServicesSection({ service }) {
  const [aService, setAService] = useState(null);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    refreshService();
  }, []);

  const refreshService = async () => {
    try {
      const response = await ServicesService.getService(service);
      if (response.data.status.code === 200) {
        setAService(response.data.response);
      } else {
        console.log("Something went wrong:", response.data.status.message);
      }
    } catch (error) {
      console.log("Something went wrong:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const serviceName =
    locale === "az"
      ? aService.serviceName
      : locale === "en"
      ? aService.serviceNameEn
      : aService.serviceNameRu;

  const sortedParts = [...aService.serviceParts].sort((a, b) => {
    if (!a.id) return 1;
    if (!b.id) return -1;
    return a.id - b.id;
  });

  return (
    <div className={style.wrapper}>
      <h2>{serviceName}</h2>

      {sortedParts.map((part, index) => {
        if (!part) return null;

        const textKey =
          locale === "az"
            ? "serviceTextAz"
            : locale === "en"
            ? "serviceTextEn"
            : "serviceTextRu";

        const partText = part[textKey] || "";
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
                <h3>{part.partName || "No Name"}</h3>
                <p>{partText}</p>
              </div>
              <div className={style.right}>
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={part.partName || "Service Part"}
                    className={style.image}
                  />
                ) : null}
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
}
