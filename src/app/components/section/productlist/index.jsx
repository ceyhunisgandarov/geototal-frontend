import Link from "next/link";
import style from "../../../../../public/assets/css/module/products/productpage.module.css";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

function ProductList({ selectedCategory }) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const t = useTranslations("Navbar");

  useEffect(() => {
    fetch("/assets/jsons/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.log("something went wrong", error));
  }, []); // sadece 1 kere fetch et

  useEffect(() => {
    if (selectedCategory) {
      // seçilen kategoriye göre filtrele
      const filtered = products.filter((p) => p.category === selectedCategory);
      setFilteredProducts(filtered);
    } else {
      // hiçbir kategori seçilmemişse tüm ürünleri göster
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  return (
    <div className={style.container2}>
      <h1 className={style.title2}>Explore Our Skin Care Product</h1>
      <p className={style.subtitle}>
        Your Path to Flawless Skin Starts Here. Harness the Power of Nature for
        Beautiful Skin
      </p>

      <div className={style.grid2}>
        {filteredProducts.map((product) => (
          <Link
            href={`/${t("locale")}/products/${product.id}`}
            key={product.id}
            className={style.card2}
          >
            <Image
              width={300}
              height={300}
              src={product.image}
              alt={product.model}
              className={style.image2}
            />
            <h3 className={style.productName}>{product.brand}</h3>
            <p className={style.desc2}>{product.model}</p>
            <button className={style.btn}>Add to cart</button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
