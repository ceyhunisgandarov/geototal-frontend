"use client";
import { useEffect, useState } from "react";
import style from "../../../../public/assets/css/module/carousel/carousel.module.css";
import CarouselService from "@/app/services/CarouselService";
import { useTranslations } from "next-intl";
import Banner from "../newbanner";

const carouselSlidesLocale = [
  {
    id: 1,
    title: "Drone Works",
    imageLink: "/images/drone-works.jpeg",
  },
  {
    id: 2,
    title: "Geodesy and Topography Works",
    imageLink: "/images/geodesy.jpg",
  },
  {
    id: 3,
    title: "Mapping and 3D Modelling",
    imageLink: "/images/mapping.jpg",
  },
  {
    id: 4,
    title: "Monitoring and Control",
    imageLink: "/images/monitoring.png",
  },
];

function Carousel() {
  const [carousel, setCarousel] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0); // index ile otomatik ilerleme için
  const t = useTranslations("Carousel");

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

  return (
    <div className={style.container}>
      <div className={style.carouselScreen}>
        <div className={style.buttonNext} onClick={nextSlide}>
          &#8680;
        </div>
        <div className={style.buttonPrev} onClick={prevSlide}>
          <span>&#8678;</span>
        </div>

        <div className={style.carouselBody}>
          <div className={style.carouselBody}>
            {carousel.map((slide, i) => (
              <Banner
                key={slide.id}
                carousel={slide}
                t={t}
                active={i === carouselIndex} // sadece aktif fade
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carousel;
