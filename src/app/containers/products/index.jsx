import LayoutSecond from "@/app/components/layout/layoutsecond";
import AboutUsSection from "@/app/components/section/aboutussection";
import Banner from "@/app/components/section/banner";
import Products from "@/app/components/section/products";

function ProductsContainer({ page, locale }) {
  return (
    <LayoutSecond page={page} locale={locale}>
      <Banner page={page} />
      <Products />
    </LayoutSecond>
  );
}

export default ProductsContainer;
