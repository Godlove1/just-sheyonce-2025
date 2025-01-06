"use client"

import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default function ProductCard({product}) {
  return (
    <>
      <Link key={product.id} href={`/product/${product.id}`} className="group">
        <div className="aspect-[4/5] relative">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority
            className="object-cover rounded-lg"
          />
          {/* Check if the product was created within the last 7 days */}
          {moment()?.diff(moment(product?.createdAt), "days") < 7 && (
            <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
              New
            </span>
          )}
        </div>
        <div className="mt-2">
          <h3 className="font-medium line-clamp-1 text-[0.76em] -mt-1 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-xs font-bold">
            &#8355;{product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </>
  );
}
