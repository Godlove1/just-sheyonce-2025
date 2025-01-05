import React from 'react'
import ClientEditProduct from '../client';

export default async function EditProductPage({ params }) {
  const { id } = await params;
  

  return <ClientEditProduct id={id} />;
}