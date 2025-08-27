"use client";
import ProductList from "../productlist";
import CategoryCarousel from "../../testcarousel";
import { useState } from "react";

function Products() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <>
      <CategoryCarousel onSelectedCategory={setSelectedCategory} />
      <ProductList selectedCategory={selectedCategory} />
    </>
  );
}

export default Products;
