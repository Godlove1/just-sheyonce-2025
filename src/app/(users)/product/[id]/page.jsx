import React from "react";
import ProductDetailPage from "../details";

export default async function ProductPage({ params }) {
  const { id } = await params;
  console.log(id);
  return (
    <>
      <ProductDetailPage id={id} />
    </>
  );
}
