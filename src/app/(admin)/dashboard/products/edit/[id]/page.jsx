import React from 'react'
import EditProductForm from '../client';

export default async function EditProductPage({ params }) {
  const { id } = await params;
  

  return <EditProductForm productId={id} />;
}