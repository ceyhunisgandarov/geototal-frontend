import Layout from "@/app/components/layout";
import ProductComponent from "@/app/components/productcomponent";

function ProductContainer({ id, page }) {
  return (
    <Layout page={page}>
      <ProductComponent id={id} />
    </Layout>
  );
}

export default ProductContainer;
