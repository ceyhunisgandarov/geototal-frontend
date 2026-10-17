"use client";
import PageHeading from "@/app/components/pageheading";
import ProductList from "../productlist";
import CategoryCarousel from "../../testcarousel";
import { useState } from "react";

function Products({initialData} = {}) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <>
      <PageHeading page="products" />
      <CategoryCarousel onSelectedCategory={setSelectedCategory} />
      <ProductList selectedCategory={selectedCategory} initialData={initialData} />
    </>
  );
}

export default Products;
