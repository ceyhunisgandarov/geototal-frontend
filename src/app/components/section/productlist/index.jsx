"use client";

import Link from "next/link";
import Image from "next/image";
import style from "../../../../../public/assets/css/module/products/productpage.module.css";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ProductService from "@/app/services/ProductService";

function ProductList({ selectedCategory, initialData }) {
  const [products, setProducts] = useState(initialData ?? []);
  const [loading, setLoading] = useState(initialData === undefined);
  const locale = useLocale();
  const t = useTranslations("Products");

  useEffect(() => {
    if(initialData !== undefined) {setProducts(initialData); return;}
    setLoading(true);
    ProductService.getProducts()
      .then((response) => {
        if (response.data.status.code === 200) {
          setProducts(response.data.response);
        } else {
          console.log("exception: ", response.data.status.message);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [initialData]);

  const filteredProducts = selectedCategory ? products.filter(p => p.category === selectedCategory) : products;

  const skeletonArray = Array.from({ length: 6 });

  return (
    <div className={style.container2}>
      <h2 className={style.title2}>{t("explore")}</h2>
      <p className={style.subtitle}>{t("secondTitle")}</p>

      <div className={style.grid2}>
        {loading
          ? skeletonArray.map((_, index) => (
              <div key={index} className={style.cardSkeleton}>
                <div className={style.imageSkeleton}></div>
                <div className={style.textSkeleton}>
                  <div className={style.skelLine}></div>
                  <div className={style.skelLine}></div>
                  <div className={style.skelLineShort}></div>
                  <div className={style.skelButton}></div>
                </div>
              </div>
            ))
          : filteredProducts.map((product) => (
              <Link
                href={`/${locale}/products/${product.id}`}
                key={product.id}
                className={style.card2}
              >
                <div className={style.imageWrapper}>
                  <Image
                    src={
                      product.images && product.images[0]
                        ? product.images[0]
                        : "/images/fallback.jpg"
                    }
                    alt={[product.brand, product.model].filter(Boolean).join(" ")}
                    width={300}
                    height={300}
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw"
                    className={style.productImage}
                  />
                </div>

                <h3 className={style.productName}>{product.brand}</h3>
                <p className={style.desc2}>{product.model}</p>
                <button className={style.btn}>{t("get")}</button>
              </Link>
            ))}
      </div>
    </div>
  );
}

export default ProductList;