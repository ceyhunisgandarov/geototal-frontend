"use client";
import style from "../../../../public/assets/css/module/servicescards/container.module.css";
import Icon from "../elements/icon";
import { useEffect, useState } from "react";
import ServicesService from "@/app/services/ServicesService";
import { useTranslations } from "next-intl";

function ServiceBody() {
  const t = useTranslations("Navbar");

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshServices();
  }, []);

  const refreshServices = () => {
    ServicesService.getServices()
      .then((response) => {
        if (response.data.status.code === 200) {
          setServices(response.data.response);
        }
      })
      .catch((error) => {
        console.log("Something wrong error-", error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={style.container}>
      <div className={style.serviceContainer}>
        <h1>{t("serv")}</h1>

        <div className={style.cardContainer}>
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className={`${style.gridItem} ${style.skeletonCard}`}
                  aria-hidden="true"
                >
                  <div className={style.skeletonImage} />
                  <div className={style.skeletonTitle} />
                </div>
              ))
            : services.map((service, index) => (
                <Icon
                  key={index}
                  path={service.serviceImageUrl}
                  service={service}
                  background="light"
                />
              ))}
        </div>
      </div>
    </div>
  );
}

export default ServiceBody;
