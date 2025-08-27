"use client";
import Image from "next/image";
import style from "../../../../public/assets/css/module/carousel/carousel.module.css";
import { useEffect, useState, useRef } from "react";

const carouselSlides = [
  { id: 1, text: "Drone Works", img: "/images/drone-works.jpeg" },
  { id: 2, text: "Geodesy and Topography Works", img: "/images/geodesy.jpg" },
  { id: 3, text: "Mapping and 3D Modelling", img: "/images/mapping.jpg" },
  { id: 4, text: "Monitoring and Control", img: "/images/monitoring.png" },
];

function Carousel() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const slideRefs = useRef([]);

  // Typewriter effect
  useEffect(() => {
    if (charIndex === carouselSlides[carouselIndex].text.length) {
      const timeout = setTimeout(() => {
        setCarouselIndex((prev) => (prev + 1) % carouselSlides.length);
        setCharIndex(0);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    const delay = charIndex === 0 ? 500 : 50;

    const timeout = setTimeout(() => {
      setDisplayedText(
        carouselSlides[carouselIndex].text.slice(0, charIndex + 1)
      );
      setCharIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timeout);
  }, [charIndex, carouselIndex]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(style.active);
          } else {
            entry.target.classList.remove(style.active);
          }
        });
      },
      { threshold: 0.5 }
    );

    slideRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const nextSlide = () => {
    setCarouselIndex((prev) =>
      prev < carouselSlides.length - 1 ? prev + 1 : 0
    );
    setCharIndex(0);
    setDisplayedText("");
  };

  const prevSlide = () => {
    setCarouselIndex((prev) =>
      prev > 0 ? prev - 1 : carouselSlides.length - 1
    );
    setCharIndex(0);
    setDisplayedText("");
  };

  return (
    <div className={style.container}>
      <div className={style.carouselScreen}>
        <div className={style.buttonNext} onClick={nextSlide}>
          &#xf105;
        </div>
        <div className={style.buttonPrev} onClick={prevSlide}>
          &#xf104;
        </div>
        <div
          className={style.carouselBody}
          style={{
            transform: `translateX(-${carouselIndex * 25}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {carouselSlides.map((slide, i) => (
            <div
              key={slide.id}
              ref={(el) => (slideRefs.current[i] = el)}
              className={style.carouselStep}
            >
              <div className={style.imageWrapper}>
                <Image
                  src={slide.img}
                  alt={slide.text}
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className={style.overlay}>
          <p className={style.text}>{displayedText}</p>
        </div>
      </div>
    </div>
  );
}

export default Carousel;
