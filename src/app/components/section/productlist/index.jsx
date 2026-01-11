"use client";

import Link from "next/link";
import Image from "next/image";
import style from "../../../../../public/assets/css/module/products/productpage.module.css";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ProductService from "@/app/services/ProductService";

function ProductList({ selectedCategory }) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // loading state
  const t = useTranslations("Products");

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = products.filter((p) => p.category === selectedCategory);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  // Skeleton array (placeholder) üret
  const skeletonArray = Array.from({ length: 6 });

  return (
    <div className={style.container2}>
      <h1 className={style.title2}>{t("explore")}</h1>
      <p className={style.subtitle}>
        {t("secondTitle")}
      </p>

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
                href={`/${t("locale")}/products/${product.id}`}
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
                    alt={product.model}
                    width={300}
                    height={300}
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
