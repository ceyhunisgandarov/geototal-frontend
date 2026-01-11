"use client";
import { useEffect, useState } from "react";
import style from "../../../../../public/assets/css/module/service/servicepage.module.css"; // public-altından çıxardıq
import Image from "next/image";
import ServicesService from "@/app/services/ServicesService";
import { useLocale } from "next-intl";

export default function ServicesSection({ service }) {
  const [aService, setAService] = useState(null);
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
    }
  };

  if (!aService || !aService.serviceParts) {
    return <div>Loading...</div>;
  }

  const serviceName =
    locale === "az"
      ? aService.serviceName
      : locale === "en"
      ? aService.serviceNameEn
      : aService.serviceNameRu;

  return (
    <div className={style.wrapper}>
      <h2>{serviceName}</h2>

      {aService.serviceParts.map((part, index) => {
        if (!part) return null;

        // Dil seçimi
        const textKey =
          locale === "az"
            ? "serviceTextAz"
            : locale === "en"
            ? "serviceTextEn"
            : "serviceTextRu";

        const partText = part[textKey] || ""; // null-safe

        const imageSrc = part.serviceImageUrl || "/placeholder.png"; // null varsa placeholder istifadə et

        const sectionClass = index % 2 === 0 ? style.dark : style.gray;

        return (
          <div key={part.id || index} className={sectionClass}>
            <section
              className={`${style.section} ${index % 2 !== 0 ? style.reverse : ""}`}
            >
              <div className={style.left}>
                <h3>{part.partName || "No Name"}</h3>
                <p>{partText}</p>
              </div>
              <div className={style.right}>
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={part.partName || "Service Part"}
                    width={600}
                    height={400}
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
