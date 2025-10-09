import { useEffect, useState } from "react";
import style from "../../../../../public/assets/css/module/service/servicepage.module.css";
import Image from "next/image";

export default function ServicesSection() {
  return (
    <div className={style.wrapper}>
      {/* 1. Section - Black */}
      <div className={style.dark}>
        <section className={`${style.section} ${style.dark}`}>
          <div className={style.left}>
            <h2>PHOTOGRAMMETRY SOFTWARE AND GEOSPATIAL SERVICES</h2>
            <p>
              DroneMapper provides two licensed versions of its desktop
              photogrammetry software, REMOTE EXPERT and RAPID, as Windows
              applications. REMOTE EXPERT generates Orthomosaics and DEMs at
              selectable imagery resolutions processing up to 10,000 images per
              project. RAPID provides the same functionality as REMOTE EXPERT
              and is limited to 250 images per project. Both versions are easily
              licensed either perpetually for REMOTE EXPERT or yearly for RAPID.
            </p>
          </div>
          <div className={style.right}>
            <Image
              src="/images/services/photo.png"
              alt="Photogrammetry software"
              width={600}
              height={400}
              className={style.image}
            />
          </div>
        </section>
      </div>

      <div className={style.gray}>
        <section className={`${style.section} ${style.gray} ${style.reverse}`}>
          <div className={style.left}>
            <h2>
              GEOREFERENCED ORTHOMOSAIC, DEM, DTM, NDVI AND POINT CLOUD
              GENERATION
            </h2>
            <p>
              Derived from our photogrammetry products, we provide precision
              georeferenced contours, orthomosaic planimetrics, accurate
              volumetrics for stockpiles or reservoir capacity, radiometrically
              calibrated multi-band vegetation indices, biomass estimation, crop
              health maps and more.
            </p>
          </div>
          <div className={style.right}>
            <Image
              src="/images/services/geo.png"
              alt="Georeferenced orthomosaic"
              width={600}
              height={400}
              className={style.image}
            />
          </div>
        </section>
      </div>

      <div className={style.dark}>
        {/* 3. Section - Black */}
        <section className={`${style.section} ${style.dark}`}>
          <div className={style.left}>
            <h2>PRECISION AGRICULTURE AND ENTERPRISE SOLUTIONS</h2>
            <p>
              Large Areas of Interest (AOIs) can require billions of pixels
              processed at the highest resolution, and these files can get huge.
              We handle these big data issues on our cloud servers and provide
              automated data analytics for extracting and illustrating critical
              parameters of interest.
            </p>
          </div>
          <div className={style.right}>
            <Image
              src="/images/services/agri.png"
              alt="Precision agriculture"
              width={600}
              height={400}
              className={style.image}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
