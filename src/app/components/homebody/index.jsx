"use client";
import { useEffect, useRef, useState } from "react";
import style from "../../../../public/assets/css/module/homebody/homebody.module.css";
import Card from "../elements/card";
import ProductService from "@/app/services/ProductService";
import Image from "next/image";
import { useTranslations } from "next-intl";

const more = {
  id: 999,
  brand: "Get More",
  module: "",
};

export default function HomeBody() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // <-- Skeleton için
  const [cardCount, setCardCount] = useState(7);

  const t = useTranslations("Products")
  const contentRef = useRef(null);

  const updateCount = () => {
    const width = window.innerWidth;
    if (width <= 640) setCardCount(3);
    else if (width <= 900) setCardCount(5);
    else setCardCount(7);
  };

  useEffect(() => {
    refreshProduct();
  }, []);

  const refreshProduct = () => {
    setLoading(true); // Skeleton başlasın
    ProductService.getProducts().then((response) => {
      if (response.data.status.code === 200) {
        const allProducts = response.data.response;

        // 1. Bestseller olanları filtrele
        const bestsellerProducts = allProducts.filter((p) => p.bestseller);

        // 2. Eğer yeterliyse sadece bestsellerları al
        if (bestsellerProducts.length >= 7) {
          setProducts(bestsellerProducts.slice(0, 7));
        } else {
          // 3. Eksik sayıyı doldurmak için bestseller olmayanları al
          const remainingCount = 7 - bestsellerProducts.length;
          const nonBestsellerProducts = allProducts.filter(
            (p) => !p.bestseller
          );
          const combinedProducts = [
            ...bestsellerProducts,
            ...nonBestsellerProducts.slice(0, remainingCount),
          ];
          setProducts(combinedProducts);
        }
      }
      setLoading(false); // Yükləndi
    });
  };

  useEffect(() => {
    updateCount();

    window.addEventListener("resize", updateCount);
    return () => {
      window.removeEventListener("resize", updateCount);
    };
  }, []);

  const renderSkeleton = () => {
    return Array.from({ length: cardCount + 1 }).map((_, index) => (
      <div key={index} className={style.skeletonCard}></div>
    ));
  };

  return (
    <div className={style.wrapper}>
      <div ref={contentRef} className={style.content}>
        <div className={style.sectionTitle}>
          <h1>{t("title")}</h1>
          <span className={style.icon}>
            <Image
              src="/images/icons/products-icon.png"
              alt="koffee"
              width={40}
              height={40}
              className={style.iconImg}
            />
          </span>
          <p>
            {t("description")}
          </p>
        </div>
        <div className={style.grid}>
          {loading
            ? renderSkeleton()
            : products
                .slice(0, cardCount)
                .map((product, key) => (
                  <Card product={product} key={key} more={false} />
                ))}
          {!loading && <Card product={more} more={true} />}
        </div>
      </div>
    </div>
  );
}
