"use client";
import Image from "next/image";
import style from "../../../../public/assets/css/module/aboutussection/aboutuscontent.module.css";
import { useEffect, useState } from "react";
import AboutService from "@/app/services/AboutService";
import { useTranslations } from "next-intl";

function AboutUsContent() {
  const t = useTranslations("AboutUs");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AboutService.getAboutInfo("first")
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

  let contentTitle = "";
  let contentSecond = "";
  let text = "";

  if (content) {
    switch (t("locale")) {
      case "az":
        contentTitle = content.title;
        contentSecond = content.secondTitle;
        text = content.description;
        break;
      case "en":
        contentTitle = content.titleEn;
        contentSecond = content.secondTitleEn;
        text = content.descriptionEn;
        break;
      case "ru":
        contentTitle = content.titleRu;
        contentSecond = content.secondTitleRu;
        text = content.descriptionRu;
        break;
      default:
        contentTitle = "error";
        contentSecond = "error";
        text = "error";
    }
  }

  return (
    <section className={style.mainSection}>
      {loading ? (
        <div className={style.whySection}>
          <div className={style.imageWrapper}>
            <div className={style.skeletonImage}></div>
            <div className={style.skeletonProject}></div>
          </div>

          <div className={style.aboutText}>
            <div className={`${style.skeletonText} ${style.short}`}></div>
            <div className={`${style.skeletonText} ${style.medium}`}></div>
            <div className={`${style.skeletonText} ${style.long}`}></div>
            <div className={`${style.skeletonText} ${style.long}`}></div>
          </div>
        </div>
      ) : (
        <div className={style.whySection}>
          <div className={style.imageWrapper}>
            <Image
              src={content?.imageUrl || "/images/aboutus.png"}
              alt="About us"
              width={500}
              height={500}
              className={style.aboutImage}
            />
            <div className={style.projectCount}>
              <h2>{content?.approximatelyProjectsCount || 0}+</h2>
              <p>Project</p>
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

export default AboutUsContent;