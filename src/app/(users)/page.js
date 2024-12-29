"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategoriesNav } from "@/components/categories-nav";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useStore } from "@/lib/store";

const ITEMS_PER_PAGE = 8;

export default function Home() {
  const {
    selectedCategory,
    searchQuery,
    products,
    error,
    setError,
    clearError,
  } = useStore();
  const [page, setPage] = useState(1);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [...new Set(products.map((product) => product.category))];

  const getFilteredProducts = useCallback(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, products]);


  useEffect(() => {
    const filteredProducts = getFilteredProducts();
    setPage(1);
    setDisplayedProducts(filteredProducts.slice(0, ITEMS_PER_PAGE));
    setHasMore(filteredProducts.length > ITEMS_PER_PAGE);
  }, [selectedCategory, searchQuery, getFilteredProducts]);



  const loadMore = useCallback(async () => {
    setIsLoading(true);
    try {
      const filteredProducts = getFilteredProducts();
      const nextPage = page + 1;
      const nextProducts = filteredProducts.slice(0, nextPage * ITEMS_PER_PAGE);
      setDisplayedProducts(nextProducts);
      setPage(nextPage);
      setHasMore(nextProducts.length < filteredProducts.length);
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      setError("Failed to load more products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page, getFilteredProducts, setError]);


  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);


  return (
    <>
      <div className="min-h-screen pb-20">
        <CategoriesNav categories={categories} />

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={clearError}
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {displayedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group"
              >
                <div className="aspect-[4/5] relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                  {product.isNew && (
                    <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="font-medium line-clamp-1 text-[0.76em] -mt-1 group-hover:text-gray-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-xs">&#8355;{product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>

          {displayedProducts.length === 0 ? (
            <div className="text-center mt-16 space-y-4">
              <p className="text-gray-500">No products found</p>
              <Button variant="outline" asChild>
                <Link href="https://wa.me/1234567890" className="text-xs">
                  Can't find what you're looking for? Contact us
                </Link>
              </Button>
            </div>
          ) : hasMore ? (
            <div className="w-full flex justify-center items-center mt-8">
              <Button
                variant="outline"
                className="text-sm bg-black text-white rounded-full shadow-md"
                onClick={loadMore}
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner /> : "Load more"}
              </Button>
            </div>
          ) : (
            <div className="text-center mt-16  space-y-4">
              <p className="text-gray-500 text-xs">that's all for now</p>
              <Button variant="outline" asChild>
                <Link href="https://wa.me/1234567890" className="text-xs">
                  Can't find what you're looking for? Contact us
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
