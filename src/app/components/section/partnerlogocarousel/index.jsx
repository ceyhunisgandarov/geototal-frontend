import Image from "next/image";
import style from "../../../../../public/assets/css/module/logoslider/logoslider.module.css"

const logos = [
  "NW", "pasha", "sb", "kalyon", "kbt", "alians", "stp"
]

function PartnerLogoCarousel() {
  return (
    <div className={style.logoSlider}>
      <div className={style.logoTrack}>
        {[...logos, ...logos].map((logo, index) => (
          <div key={index} className={style.logoItem}>
            <Image
              src={`/images/logo/${logo}-logo.png`}
              alt="logo-NW"
              width={500}
              height={500}
              className={style.logo}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartnerLogoCarousel;
