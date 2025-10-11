"use client";
import Image from "next/image";
import style from "../../../../../public/assets/css/module/logoslider/logoslider.module.css";
import { useEffect, useState } from "react";
import CollaborationService from "@/app/services/CollaborationService";

const localLogos = ["NW", "pasha", "sb", "kalyon", "kbt", "alians", "stp"];

function PartnerLogoCarousel() {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    CollaborationService.getCollaborationList()
      .then((response) => {
        if (response.data.status.code === 200) {
          setLogos(response.data.response);
        } else {
          setLogos([]);
        }
      })
      .catch((error) => {
        console.log("something went wrong - ", error);
      });
  }, []);

  // karar: logos sayısı < 5 ise localLogos kullanılacak
  const renderLogos =
    logos.length >= 5
      ? [...logos, ...logos] // DB’den gelen logoları 2 kere göster
      : [...localLogos, ...localLogos]; // fallback array 2 kere göster

  return (
    <div className={style.logoSlider}>
      <div className={style.logoTrack}>
        {renderLogos.map((logo, index) => (
          <div
            key={
              typeof logo === "string"
                ? logo + "-" + index
                : logo.id + "-" + index
            }
            className={style.logoItem}
          >
            <Image
              src={
                logo.imageUrl
                  ? logo.imageUrl
                  : `/images/logo/${logo.imageUrl ? logo.name : logo}-logo.png`
              }
              alt={logo.name || `logo-${logo}`}
              className={style.logoImage}
              width={150}
              height={150}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartnerLogoCarousel;
