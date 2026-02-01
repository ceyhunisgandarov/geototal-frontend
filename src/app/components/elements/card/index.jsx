import Image from "next/image";
import style from "../../../../../public/assets/css/module/card/card.module.css";
import Link from "next/link";

function Card({ product, more, moreText, locale }) {
  return (
    <Link
      className={style.card}
      href={more ? `/${locale}/products` : `/${locale}/products/${product.id}`}
    >
      <Image
        src={product?.images?.[0] ?? "/images/product-999.png"}
        width={1200}
        height={1200}
        alt="product"
        className={style.image}
      />
      <div className={style.overlay}></div>
      <div className={style.textContainer}>
        <p className={style.text}>
          <strong>{more ? moreText : product.brand}</strong>
          <br />
          {product.model}
        </p>
      </div>
      <div className={style.textHover}>
        <strong>{more ? moreText : product.brand}</strong>
        <br />
        {product.model}
      </div>
    </Link>
  );
}

export default Card;
