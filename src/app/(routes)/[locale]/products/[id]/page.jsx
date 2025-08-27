"use client";
import ProductContainer from "@/app/containers/product";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams(); // useParams() parametre almaz
  const { id } = params; // URL’deki [id] buradan geliyor

  return (
    <>
      <ProductContainer id={id} page={`products/${id}`} />
    </>
  );
}
