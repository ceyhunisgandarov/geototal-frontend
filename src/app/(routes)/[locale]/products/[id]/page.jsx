"use client";
import ProductContainer from "@/app/containers/product";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams(); 
  const { id } = params;

  return (
    <>
      <ProductContainer id={id} page={`products/${id}`} />
    </>
  );
}
