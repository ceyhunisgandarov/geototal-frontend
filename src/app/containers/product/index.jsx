import Layout from "@/app/components/layout";
import ProductComponent from "@/app/components/productcomponent";

function ProductContainer({ id, page, initialData }) {
  return (
    <Layout page={page}>
      <ProductComponent key={id} id={id} initialData={initialData} />
    </Layout>
  );
}

export default ProductContainer;
