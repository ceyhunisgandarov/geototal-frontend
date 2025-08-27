"use client";
import { useEffect, useState } from "react";
import style from "../../../../public/assets/css/module/product/product.module.css";
import Image from "next/image";
import Link from "next/link";

function ProductComponent({ id }) {
  const [product, setProduct] = useState({});

  useEffect(() => {
    fetch("/assets/jsons/products.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.id === parseInt(id));
        console.log(found);
        setProduct(found);
      });
  }, [id]);

  return (
    <main className={style.container}>
      <div className={style.imageContainer}>
        <Image
          src={product.image}
          alt={product.model}
          width={400}
          height={400}
          className={style.productImage}
        />
      </div>
      <div className={style.textContainer}>
        <h2 className={style.brand}>{product.brand}</h2>
        <h1 className={style.model}>{product.model}</h1>
        <p className={style.description}>{product.description}</p>

        <div className={style.details}>
          <span className={style.category}>Kategori: {product.category}</span>
          {product.bestseller === "yes" && (
            <span className={style.bestseller}>⭐ Çok Satan</span>
          )}
        </div>

        <div className={style.actions}>
          <button className={style.shopBtn}>Satın Al</button>
        </div>
        <Link
          href="/assets/pdf/file.pdf"
          download
          className={style.pdfBtn}
        >
          📄 Ürün Kataloğu (PDF)
        </Link>
      </div>
    </main>
  );
}

export default ProductComponent;
