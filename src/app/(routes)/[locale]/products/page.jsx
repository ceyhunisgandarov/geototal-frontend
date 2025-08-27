import ProductsContainer from "@/app/containers/products";
import { useTranslations } from "next-intl";

function ProductsPage() {

  const t = useTranslations("Menu");

  return (
    <div>
      <ProductsContainer page="products" locale={t("locale")}/>
    </div>
  );
}

export default ProductsPage;
