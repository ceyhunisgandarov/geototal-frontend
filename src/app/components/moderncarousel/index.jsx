"use client";
import Link from "next/link";
import styles from "../../../../public/assets/css/module/carousel/modern.module.css";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "use-intl";
import CarouselService from "@/app/services/CarouselService";

export default function ModernCarousel() {
  const t = useTranslations("Carousel");
  const videoRef = useRef(null);

  const [carousel, setCarousel] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0); // index ile otomatik ilerleme için

  useEffect(() => {
    CarouselService.getCarouselData()
      .then((response) => {
        if (response?.data?.status?.code === 200)
          setCarousel(response.data.response);
        else setCarousel(carouselSlidesLocale);
      })
      .catch(() => setCarousel(carouselSlidesLocale));
  }, []);

  useEffect(() => {
    if (carousel.length === 0) return;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carousel.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [carousel]);

  const nextSlide = () =>
    setCarouselIndex((prev) => (prev + 1) % carousel.length);
  const prevSlide = () =>
    setCarouselIndex((prev) => (prev - 1 + carousel.length) % carousel.length);

  // aktif slide objesini al
  const currentSlide = carousel[carouselIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, []);

  const carouselElement = carousel[carouselIndex]
    ? {
        az: {
          title: carousel[carouselIndex].title,
          slogan: carousel[carouselIndex].slogan,
          description: carousel[carouselIndex].description,
        },
        en: {
          title: carousel[carouselIndex].titleEn,
          slogan: carousel[carouselIndex].sloganEn,
          description: carousel[carouselIndex].descriptionEn,
        },
        ru: {
          title: carousel[carouselIndex].titleRu,
          slogan: carousel[carouselIndex].sloganRu,
          description: carousel[carouselIndex].descriptionRu,
        },
      }
    : {};

  return (
    <section className={styles.sliderArea}>
      <div className={`${styles.singleSlide} ${styles.active}`}>
        <video
          ref={videoRef}
          className={styles.bgVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src="/images/bg-videoo.mp4"
        />
        <div className={styles.bannerContent}>
          <div className={styles.bannerContentContainer}>
            <div className={styles.bannerContentRow}>
              <div className={styles.bannerContentCol}>
                <div className={styles.textContentWrapper}>
                  {/* {carousel && 
                    // carousel.map((carouselItem) => (
                    //   <div className={styles.textContent} key={carouselItem.id}>
                    //     <h3>{carouselElement[t("locale")]?.title}</h3>
                    //     <h1>{carouselElement[t("locale")]?.slogan}</h1>
                    //     <p>{carouselElement[t("locale")]?.description}</p>

                    //     <div className={styles.bannerBtn}>
                    //       <Link className={styles.bannerLink} href={`${t("locale")}/${carouselItem.link}`}>
                    //         <span>{t("more")}</span>
                    //       </Link>
                    //     </div>
                    //   </div> */}
                  {carousel.map((item, index) =>
                    index === carouselIndex ? (
                      <div className={styles.textContent} key={item.id}>
                        <h3>{carouselElement[t("locale")]?.title}</h3>
                        <h1>{carouselElement[t("locale")]?.slogan}</h1>
                        <p>{carouselElement[t("locale")]?.description}</p>
                        <div className={styles.bannerBtn}>
                          <Link
                            className={styles.bannerLink}
                            href={`${t("locale")}/${item.link}`}
                          >
                            <span>{t("more")}</span>
                          </Link>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          className={`${styles.navBtn} ${styles.prev}`}
          onClick={prevSlide}
        >
          ‹
        </button>
        <button
          className={`${styles.navBtn} ${styles.next}`}
          onClick={nextSlide}
        >
          ›
        </button>
      </div>
    </section>
  );
}
