"use client";
import { localizedText } from "@/lib/localizedText";

import Image from "next/image";
import style from "../../../../public/assets/css/module/aboutussection/second.module.css";
import { useEffect, useState } from "react";
import AboutService from "@/app/services/AboutService";
import { useLocale, useTranslations } from "next-intl";

function SecondAboutUsContent() {
  const t = useTranslations("AboutUs");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AboutService.getAboutInfo("second")
      .then((response) => {
        if (response.data.status.code === 200) {
          setContent(response.data.response);
        } else {
          console.warn("Fallback: default info used");
        }
      })
      .catch((err) => {
        console.error("Error fetching about info:", err);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 100);
      });
  }, []);

  const locale = useLocale();
  const contentTitle = localizedText(content, "title", locale);
  const contentSecond = localizedText(content, "secondTitle", locale);
  const text = localizedText(content, "description", locale);

  return (
    <section className={style.mainSection}>
      {loading ? (
        <div className={style.whySection}>
          <div className={style.aboutText}>
            <div className={`${style.skeletonText} ${style.short}`}></div>
            <div className={`${style.skeletonText} ${style.medium}`}></div>
            <div className={`${style.skeletonText} ${style.long}`}></div>
          </div>

          <div className={style.imageWrapper}>
            <div className={style.skeletonImage}></div>
            <div className={style.skeletonProject}></div>
          </div>
        </div>
      ) : (
        <div className={style.whySection}>
          <div className={style.imageWrapper}>
            <Image
              src={content?.imageUrl || "/images/aboutus.png"}
              alt="Construction Workers"
              width={500}
              height={500}
              className={style.aboutImage}
            />
            <div className={style.projectCount}>
              <h2>{content?.approximatelyStaffsCount || 0}+</h2>
              <p>{t("staffCount")}</p>
            </div>
          </div>

          <div className={style.aboutText}>
            <section>
              <div>
                <div>
                  <h4>{contentTitle}</h4>
                  <h2>{contentSecond}</h2>
                </div>
                <div
                  className={style.aboutContent}
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              </div>
            </section>
          </div>
        </div>
      )}
    </section>
  );
}

export default SecondAboutUsContent;