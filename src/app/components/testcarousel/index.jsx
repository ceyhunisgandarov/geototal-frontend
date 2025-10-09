"use client";
import { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import Image from "next/image";
import style from "../../../../public/assets/css/module/test/test.module.css";

const categories = [
  { name: "TotalStation", icon: "/images/categories/ts-icon.png", category: "TOTAL_STATION" },
  { name: "GNSS", icon: "/images/categories/gnss-icon.png", category: "GNSS" },
  { name: "Auto Level", icon: "/images/categories/al-icon.png", category: "AUTO_LEVEL" },
  { name: "Controller", icon: "/images/categories/controller-icon.png", category: "CONTROLLER" },
  { name: "Accesories", icon: "/images/categories/acc-icon.png", category: "ACCESSORIES" },
  { name: "Software", icon: "/images/categories/soft-icon.png", category: "SOFTWARE" },
];

const CategoryCarousel = ({ onSelectedCategory }) => {
  const carouselRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [visibleCards, setVisibleCards] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);

  const updateCardWidth = () => {
    if (!carouselRef.current) return;
    const containerWidth = carouselRef.current.offsetWidth;
    let cols = 2;
    if (containerWidth >= 1200) cols = 5;
    else if (containerWidth >= 900) cols = 4;
    else if (containerWidth >= 600) cols = 3;
    setVisibleCards(cols);
    setCardWidth(containerWidth / cols - 20); // 20px gap varsayımı
  };

  useEffect(() => {
    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  const toNext = () => {
    if (currentIndex < categories.length - visibleCards) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setTranslateX(-(nextIndex * (cardWidth + 20)));
    }
  };

  const toPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setTranslateX(-(prevIndex * (cardWidth + 20)));
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => toNext(),
    onSwipedRight: () => toPrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleClick = (category) => {
    setActiveCategory(category); // aktif efekti için state
    onSelectedCategory && onSelectedCategory(category); // callback
  };

  return (
    <div className={style.container}>
      <h1>Categories</h1>
      {currentIndex > 0 && (
        <button className={`${style.arrow} ${style.left}`} onClick={toPrev}>
          ◀
        </button>
      )}

      <div className={style.carouselScene} {...handlers}>
        <div
          className={style.carouselBody}
          ref={carouselRef}
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {categories.map((cat, i) => (
            <div
              key={i}
              className={`${style.categoryCard} ${
                activeCategory === cat.category ? style.active : ""
              }`}
              style={{ minWidth: `${cardWidth}px` }}
              onClick={() => handleClick(cat.category)}
            >
              <Image className={style.categoryIcon} src={cat.icon} alt={cat.name} width={80} height={80} />
              <p>{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      {currentIndex < categories.length - visibleCards && (
        <button className={`${style.arrow} ${style.right}`} onClick={toNext}>
          ▶
        </button>
      )}
    </div>
  );
};

export default CategoryCarousel;
