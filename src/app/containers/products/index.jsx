import Layout from "@/app/components/layout";
import Banner from "@/app/components/section/banner";
import Products from "@/app/components/section/products";

function ProductsContainer({ page, locale }) {
  return (
    <Layout page={page} locale={locale}>
      <Banner page={page} />
      <Products />
    </Layout>
  );
}

export default ProductsContainer;
