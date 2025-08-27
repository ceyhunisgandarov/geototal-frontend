import Layout from "@/app/components/layout";
import LayoutSecond from "@/app/components/layout/layoutsecond";
import ProductComponent from "@/app/components/productcomponent";

function ProductContainer({ id, page }) {
  return (
    <LayoutSecond page={page}>
      <ProductComponent id={id} />
    </LayoutSecond>
  );
}

export default ProductContainer;
