"use client";
import { useEffect, useState, useTransition } from "react";
import style from "../../../../../public/assets/css/module/banner/banner.module.css";
import BannerService from "@/app/services/BannerService";
import { useTranslations } from "next-intl";

function Banner({ page }) {
  const [bannerImage, setBannerImage] = useState(`url("/images/banners/${page}.png")`);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Banner")
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
      bannerHeader = t("project");
      break;
    case "certificate":
      bannerHeader = t("certificate");
      break;
    default:
      bannerHeader = "Error";
      break;
  }

  useEffect(() => {
    setLoading(true);
    BannerService.getBanner(page)
      .then((response) => {
        if (response.data.status.code === 200) {
          const imageUrl = response.data.response.imageUrl;
          setBannerImage(`url("http://localhost:8080/geototal/user/image/${imageUrl}")`);
        } else {
          setBannerImage(`url("/images/banners/${page}.png")`);
        }
      })
      .catch(() => {
        setBannerImage(`url("/images/banners/${page}.png")`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  return (
    <div
      className={style.container}
      style={{
        backgroundImage: !loading ? bannerImage : "none",
      }}
    >
      {loading ? (
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
