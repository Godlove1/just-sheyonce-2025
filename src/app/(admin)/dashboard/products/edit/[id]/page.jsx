import React from 'react'
import ClientEditProduct from '../client';

export default async function EditProductPage({ params }) {
  const { id } = await params;
  // const product = await fetchProduct(id); 

  return <ClientEditProduct  />;
}