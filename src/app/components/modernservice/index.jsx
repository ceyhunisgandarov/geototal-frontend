"use client";
import { localizedText } from "@/lib/localizedText";
import Link from "next/link";
import styles from "../../../../public/assets/css/module/modern/service.module.css";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ServicesService from "@/app/services/ServicesService";

export default function ModernService({initialData} = {}) {
  const t = useTranslations("HomeService");
  const locale = useLocale();
  const [services, setServices] = useState(initialData?.slice(0,4) ?? []);

  useEffect(() => {
    if(initialData !== undefined) {setServices(initialData?.slice(0,4) ?? []); return;}
    refreshServices();
  }, [initialData]);

  const refreshServices = () => {
    ServicesService.getServices()
      .then((response) => {
        if (response.data.status.code === 200) {
          setServices(response.data.response.slice(0, 4));
        } else {
          console.log("Something wrong error-", response.data.status.message);
        }
      })
      .catch((error) => {
        console.log("Something wrong error-", error);
      });
  };

  return (
    <section className={styles.specialArea}>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <div className={styles.sectionTitle}>
            <h2>{t("title")}</h2>
            <span className={styles.icon}>
              <Image
                src="/images/icons/card-icon.svg"
                alt=""
                width={40}
                height={40}
                className={styles.iconImg}
              />
            </span>
            <p>{t("description")}</p>
          </div>
        </div>
      </div>

      <div className={styles.gridWrapper}>
        <div className={styles.grid}>
          {services &&
            services.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.itemContent}>
                  <Image
                    src={item.serviceImageUrl}
                    alt={localizedText(item, "serviceName", locale)}
                    className={styles.image}
                    width={300}
                    height={300}
                  />

                  <div className={styles.hover}>
                    <Service service={item} locale={locale} />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

function Service({ service, locale }) {
  const t = useTranslations("HomeService");
  const titleService = localizedText(service, "serviceName", locale);

  return (
    <div className={styles.hoverText}>
      <h3>{titleService}</h3>
      <Link href={`/${locale}/services/${service.pathName}`}>
        <span className={styles.price}>{t("more")}</span>
      </Link>
    </div>
  );
}
