import Image from "next/image";
import style from "../../../../../public/assets/css/module/card/card.module.css";
import Link from "next/link";

function Card({ product, more }) {
  return (
    <div className={style.card}>
      <Image
        src={`/images/product-${product.id}.png`}
        width={1200}
        height={1200}
        alt="product"
        className={style.image}
      />
      <div className={style.overlay}></div>
      <div className={style.textContainer}>
        <p className={style.text}>
          <strong>{product.brand}</strong>
          <br />
          {product.model}
        </p>
      </div>
      <div className={style.textHover}>
        <strong>{product.brand}</strong>
        <br />
        {product.model}
        <Link  href={more ? "/az/products" : `/az/products/${product.id}`} className={style.shoppingButton}>İNDİ SİFARİŞ ET</Link>
      </div>
    </div>
  );
}

export default Card;
