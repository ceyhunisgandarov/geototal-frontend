"use client";

import Link from "next/link";
import styles from "../../../../public/assets/css/module/carousel/modern.module.css";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import CarouselService from "@/app/services/CarouselService";
import Image from "next/image";

export default function ModernCarousel() {
  const t = useTranslations("Carousel");
  const videoRef = useRef(null);

  const [carousel, setCarousel] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [mobile, setMobile] = useState(false);

  // SWIPE için refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleResize = () => setMobile(window.innerWidth <= 762);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    CarouselService.getCarouselData()
      .then((res) => {
        if (res?.data?.status?.code === 200) setCarousel(res.data.response);
      })
      .catch(() => {});
  }, []);

  const handleVideoEnd = () => {
    setCarouselIndex(1);
  };

  // Otomatik geçiş
  useEffect(() => {
    if (!carousel.length) return;
    if (carouselIndex === 0) return;

    const timer = setTimeout(() => {
      setCarouselIndex((prev) => (prev + 1 < carousel.length ? prev + 1 : 0));
    }, 5000);

    return () => clearTimeout(timer);
  }, [carouselIndex, carousel]);

  // Video oynatma
  useEffect(() => {
    if (carouselIndex === 0 && videoRef.current) {
      videoRef.current.load();
      videoRef.current.playbackRate = 1.5;
      videoRef.current.play();
    }
  }, [carouselIndex]);

  const locale = t("locale");

  // TOUCH / MOUSE SWIPE HANDLER
  const handleTouchStart = (e) => {
    // Eğer butona / linke basıldıysa swipe başlatma
    if (e.target.closest("a, button")) return;

    isDragging.current = true;
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    touchEndX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const distance = touchStartX.current - touchEndX.current;
    const threshold = 50; // minimum kaydırma mesafesi

    if (distance > threshold) {
      // sola kaydır → next
      setCarouselIndex((prev) => (prev + 1 < carousel.length ? prev + 1 : 0));
    } else if (distance < -threshold) {
      // sağa kaydır → prev
      setCarouselIndex((prev) => (prev === 0 ? carousel.length - 1 : prev - 1));
    }
  };

  return (
    <section
      className={styles.sliderArea}
      style={{
        backgroundImage: `url(/images/sayt-screenbg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd} // mouse kaybolunca swipe sonlansın
    >
      {carousel.map((slide, index) => {
        const carouselElement = {
          az: {
            title: slide.title,
            slogan: slide.slogan,
            description: slide.description,
          },
          en: {
            title: slide.titleEn,
            slogan: slide.sloganEn,
            description: slide.descriptionEn,
          },
          ru: {
            title: slide.titleRu,
            slogan: slide.sloganRu,
            description: slide.descriptionRu,
          },
        };

        const isActive = index === carouselIndex;

        return (
          <div
            key={slide.id}
            className={`${styles.singleSlide} ${isActive ? styles.active : ""}`}
            style={
              index !== 0 && slide.image
                ? {
                    backgroundImage: `url("/images/sayt-screenbg.jpg")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}
            }
          >
            {/* VIDEO ONLY FIRST SLIDE */}
            {index === 0 && (
              <video
                ref={isActive ? videoRef : null}
                className={styles.bgVideo}
                autoPlay={isActive}
                muted
                playsInline
                preload="auto"
                onEnded={handleVideoEnd}
              >
                <source src="/images/bg-videoo.mp4" type="video/mp4" />
              </video>
            )}

            {/* IMAGE FOR OTHER SLIDES */}
            {index === 1 && (
              <Image
                src={
                  mobile
                    ? "/images/bg/mobile-gintec.png"
                    : "/images/bg/big-screen.jpg"
                }
                width={1500}
                height={500}
                className={styles.bgImg}
                alt={slide.title}
              />
            )}

            {index === 2 && (
              <Image
                src={
                  mobile
                    ? "/images/bg/mobile-geomax.jpg"
                    : "/images/bg/big-screen-geo.jpg"
                }
                width={1500}
                height={500}
                className={styles.bgVideo}
                alt={slide.title}
              />
            )}

            {/* CONTENT */}
            <div
              className={`${
                carouselIndex === 1
                  ? styles.secondBannerContent
                  : carouselIndex === 2
                  ? styles.thirdBannerContent
                  : styles.bannerContent
              }`}
            >
              <div className={styles.textContent}>
                <h3>{carouselElement[locale]?.title}</h3>
                <h1>{carouselElement[locale]?.slogan}</h1>
                <div className={styles.pContent}>
                  <p>{carouselElement[locale]?.description}</p>
                </div>
                <div className={styles.bannerBtn}>
                  <Link
                    className={styles.bannerLink}
                    href={`${locale}/${slide.link}`}
                  >
                    <span>{t("more")}</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* NAV */}
            <button
              className={`${styles.navBtn} ${styles.prev}`}
              onClick={() =>
                setCarouselIndex(
                  carouselIndex === 0 ? carousel.length - 1 : carouselIndex - 1
                )
              }
            >
              ‹
            </button>

            <button
              className={`${styles.navBtn} ${styles.next}`}
              onClick={() =>
                setCarouselIndex(
                  carouselIndex + 1 < carousel.length ? carouselIndex + 1 : 0
                )
              }
            >
              ›
            </button>
          </div>
        );
      })}
    </section>
  );
}
