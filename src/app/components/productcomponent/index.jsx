"use client";
import { useEffect, useState } from "react";
import style from "../../../../public/assets/css/module/product/product.module.css";
import Image from "next/image";
import Link from "next/link";
import ProductService from "@/app/services/ProductService";
import { useRouter } from "next/navigation";

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;

function ProductComponent({ id }) {
  const [product, setProduct] = useState(null); // başlangıçta null yap
  const [loading, setLoading] = useState(true); // loading state
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    ProductService.getProduct(id)
      .then((response) => {
        if (response.data.status.code === 200) {
          setProduct(response.data.response);
        } else {
          router.replace("/404");
        }
      })
      .catch((error) => {
        console.log("something went wrong-", error);
        router.replace("/404"); // hata durumunda da 404
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <main className={style.container}>
        <div className={style.productContainer}>
          <div className={style.imageSkeleton}></div>
          <div className={style.textSkeleton}>
            <div className={style.skelLine}></div>
            <div className={style.skelLine}></div>
            <div className={style.skelLine}></div>
            <div className={style.skelLineShort}></div>
            <div className={style.skelButton}></div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    router.replace("/404");
    return null;
  }

  const whatsappLink = `https://wa.me/+994552053403?text=${encodeURIComponent(
    `Salam, mən ${product.brand} ${product.model} məhsulunu əldə etmək istiyirəm. Zəhmət olmasa ətraflı məlumat verərdiniz.`
  )}`;

  return (
    <main className={style.container}>
      <div className={style.productContainer}>
        <div className={style.imageContainer}>
          <Image
            width={300}
            height={300}
            src={
              product?.images?.length > 0
                ? `${BASE_IMAGE_URL + product.images[0]}`
                : "/images/admin/question.png"
            }
            alt={product?.model || "Ürün"}
            className={style.image2}
            priority
          />
        </div>
        <div className={style.textContainer}>
          <h2 className={style.brand}>{product.brand}</h2>
          <h1 className={style.model}>{product.model}</h1>

          <div className={style.details}>
            <span className={style.category}>Kategori: {product.category}</span>
            {product.bestseller === "yes" && (
              <span className={style.bestseller}>⭐ Çok Satan</span>
            )}
          </div>

          <div className={style.actions}>
            {/* WhatsApp Satın Al Butonu */}
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={style.shopBtn}
            >
              Satın Al
            </Link>
          </div>
          <Link
            href={`http://localhost:8080/geototal/user/product/pdf/${product.fileUrl}`}
            download
            className={style.pdfBtn}
          >
            📄 Ürün Kataloğu (PDF)
          </Link>
        </div>
      </div>
      <div className={style.descriptionContainer}>
        <p className={style.description}>{product.descriptionAz}</p>
      </div>
    </main>
  );
}

export default ProductComponent;
