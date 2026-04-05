"use client";

import Image from "next/image";
import style from "../../../../public/assets/css/module/test/test.module.css";
import { useTranslations } from "next-intl";
import { useState } from "react";

const categories = [
  { name: "ts", icon: "/images/categories/ts-icon.png", category: "TOTAL_STATION" },
  { name: "gnss", icon: "/images/categories/gnss-icon.png", category: "GNSS" },
  { name: "level", icon: "/images/categories/al-icon.png", category: "AUTO_LEVEL" },
  { name: "controller", icon: "/images/categories/controller-icon.png", category: "CONTROLLER" },
  { name: "accesories", icon: "/images/categories/acc-icon.png", category: "ACCESSORIES" },
  { name: "software", icon: "/images/categories/soft-icon.png", category: "SOFTWARE" },
];

const CategoryCarousel = ({ onSelectedCategory }) => {
  const t = useTranslations("Category");
  const [activeCategory, setActiveCategory] = useState(null);

  const handleClick = (category) => {
    setActiveCategory(category);
    onSelectedCategory?.(category);
  };

  return (
    <div className={style.container}>
      <h1>{t("categories")}</h1>

      <div className={style.categoriesGrid}>
        {categories.map((cat, i) => (
          <div
            key={i}
            className={`${style.categoryCard} ${
              activeCategory === cat.category ? style.active : ""
            }`}
            onClick={() => handleClick(cat.category)}
          >
            <Image
              className={style.categoryIcon}
              src={cat.icon}
              alt={cat.name}
              width={80}
              height={80}
            />
            <p>{t(cat.name)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCarousel;