"use client";
import { useEffect, useState } from "react";
import styles from "../../../../public/assets/css/module/product/product.module.css";
import Image from "next/image";
import Link from "next/link";
import ProductService from "@/app/services/ProductService";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

function ProductComponent({ id }) {
  const t = useTranslations("Product");
  const locale = useLocale();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const localizedText = (item, field, locale, fallbackField = `${field}Az`) => {
    if (!item) return "";

    const normalizedLocale = locale?.toLowerCase().split("-")[0];

    const fieldsByLocale = {
      az: [`${field}Az`],
      en: [`${field}En`],
      ru: [`${field}Ru`],
      ky: [`${field}Ky`, `${field}KY`],
    };

    const requestedFields =
      fieldsByLocale[normalizedLocale] ?? fieldsByLocale.az;

    const fallbackFields = [fallbackField, `${field}Az`, `${field}En`];

    const candidateFields = [
      ...new Set([...requestedFields, ...fallbackFields]),
    ];

    for (const fieldName of candidateFields) {
      const value = item[fieldName];

      if (typeof value === "string" && value.trim()) {
        return value;
      }
    }

    return "";
  };

  useEffect(() => {
    setLoading(true);
    ProductService.getProduct(id)
      .then((response) => {
        if (response.data.status.code === 200) {
          const data = response.data.response;
          setProduct(data);

          // 👇 ilk resmi aktif yap
          if (data.images && data.images.length > 0) {
            setActiveImage(data.images[0]);
          }
        } else {
          router.replace("/404");
        }
      })
      .catch(() => router.replace("/404"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const getCategoryKey = (category) => {
    switch (category) {
      case "TOTAL_STATION":
        return "ts";

      case "GNSS":
        return "gnss";

      case "AUTO_LEVEL":
        return "level";

      case "ACCESSORIES":
        return "accesories";

      case "CONTROLLER":
        return "controller";

      case "SOFTWARE":
        return "software";

      case "LASER_SCANNER":
        return "laser";

      default:
        return "products";
    }
  };

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.productContainer}>
          <div className={styles.imageSkeleton}></div>
          <div className={styles.textSkeleton}>
            <div className={styles.skelLine}></div>
            <div className={styles.skelLine}></div>
            <div className={styles.skelLine}></div>
            <div className={styles.skelLineShort}></div>
            <div className={styles.skelButton}></div>
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

  const downloadPdf = async (url, filename = "brochure.pdf") => {
    try {
      const res = await fetch(url);

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();

      const pdfBlob = new Blob([blob], { type: "application/pdf" });

      const a = document.createElement("a");
      a.href = URL.createObjectURL(pdfBlob);
      a.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.productMain}>
        <div className={styles.productGallery}>
          <Image
            src={activeImage}
            alt={product.model}
            width={600}
            height={600}
            className={styles.mainImg}
          />
          <div className={styles.thumbnails}>
            {product.images &&
              product.images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles.thumb} ${
                    activeImage === image ? styles.activeThumb : ""
                  }`}
                  onClick={() => setActiveImage(image)}
                >
                  <Image
                    src={image}
                    alt={product.model}
                    width={100}
                    height={100}
                    className={styles.thumbImg}
                  />
                </button>
              ))}
          </div>
        </div>

        <div className={styles.productInfo}>
          <nav className={styles.breadcrumb}>
            {t("home")} &gt; {t("products")} &gt;{" "}
            {t(getCategoryKey(product.category))}
          </nav>
          <h1 className={styles.title}>{product.brand}</h1>
          <h2 className={styles.title2}>{product.model}</h2>
          <Link href={whatsappLink} className={styles.link}>
            <button className={styles.btnAdd}>{t("get")}</button>
          </Link>
        </div>
      </div>

      <div className={styles.productBottomDetails}>
        <div className={styles.detailSection}>
          <h3>{t("description")}</h3>
          <p className={styles.description}>
            {localizedText(product, "description", locale, "descriptionAz")}
          </p>
        </div>
        <div className={styles.broschure}>
          <button
            type="button"
            className={styles.download}
            onClick={() =>
              downloadPdf(
                product.fileUrl,
                `${product.brand}-${product.model}`.replace(/\s+/g, "-") +
                  ".pdf"
              )
            }
          >
            &#8659;
          </button>
          <p>{t("broschure")}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductComponent;
