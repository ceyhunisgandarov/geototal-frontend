"use client";
import { useEffect, useState } from "react";
import style from "../../../../../public/assets/css/module/banner/banner.module.css";
import BannerService from "@/app/services/BannerService";
import { useTranslations } from "next-intl";

function Banner({ page }) {
  const [bannerImage, setBannerImage] = useState(""); // Başlanğıcda boş
  const [path, setPath] = useState("");
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Banner");

  let bannerHeader = "";
  switch (page) {
    case "aboutus":
      bannerHeader = t("about");
      break;
    case "products":
      bannerHeader = t("products");
      break;
    case "services":
      bannerHeader = t("service");
      break;
    case "contact":
      bannerHeader = t("contact");
      break;
    case "projects":
      bannerHeader = t("projects");
      break;
    case "aboutus/certificates":
      bannerHeader = t("certificate");
      break;
    case "aboutus/references":
      bannerHeader = t("references");
      break;
    default:
      bannerHeader = "Error";
      break;
  }

  useEffect(() => {
    setLoading(true);
    const currentPath = page.includes("aboutus/references") ? "references" : page;
    setPath(currentPath);

    BannerService.getBanner(currentPath)
      .then((response) => {
        if (response.data.status.code === 200) {
          const imageUrl = response.data.response.imageUrl;
          setBannerImage(`url("${imageUrl}")`);
        } else {
          // DB-də nəticə gəlmədikdə belə, shimmer göstərəcəyik
          setBannerImage(""); 
        }
      })
      .catch(() => {
        setBannerImage(""); // Error olsa da shimmer göstər
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  return (
    <div
      className={style.container}
      style={{
        backgroundImage: !loading && bannerImage ? bannerImage : "none",
      }}
    >
      {loading || !bannerImage ? (
        <div className={style.shimmer}></div>
      ) : (
        <div className={style.overlay}>
          <p>
            {bannerHeader}
            <span className={style.underline}></span>
          </p>
        </div>
      )}
    </div>
  );
}

export default Banner;
