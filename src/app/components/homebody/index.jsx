"use client";
import { useEffect, useRef, useState } from "react";
import style from "../../../../public/assets/css/module/homebody/homebody.module.css";
import Card from "../elements/card";

const more = {
  id: 999,
  brand: "Get More",
  module: "",
};

export default function HomeBody() {
  const [products, setProducts] = useState([]);
  const [cardCount, setCardCount] = useState(7);
  // const [height, setHeight] = useState("100vh");

  const contentRef = useRef(null);

  const updateCount = () => {
    const width = window.innerWidth;
    if (width <= 640) setCardCount(3);
    else if (width <= 900) setCardCount(5);
    else setCardCount(7);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/assets/jsons/products.json"); // public klasöründe olmalı
        const data = await res.json();

        // sadece bestseller olanları filtrele
        const filtered = data.filter((p) => p.bestseller === "yes");
        setProducts(filtered);
      } catch (err) {
        console.error("Ürünler yüklenirken hata:", err);
      }
    };

    fetchProducts();
  }, []);
  
  useEffect(() => {
    updateCount();

    window.addEventListener("resize", updateCount);

    return () => {
      window.removeEventListener("resize", updateCount);
    };
  }, []);

  // useEffect(() => {
  //   if (!contentRef.current) return;

  //   const observer = new ResizeObserver(() => {
  //     if (contentRef.current) {
  //       setHeight(`${contentRef.current.offsetHeight}px`);
  //     }
  //   });

  //   observer.observe(contentRef.current);

  //   return () => observer.disconnect();
  // }, []);

  return (
    <div className={style.wrapper}>
      <div ref={contentRef} className={style.content}>
        <div className={style.grid}>
          {products &&
            products
              .slice(0, cardCount)
              .map((product, key) => (
                <Card product={product} key={key} more={false} />
              ))}
          <Card product={more} more={true} />
        </div>
      </div>
    </div>
  );
}
