"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategoriesNav } from "@/components/categories-nav";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useStore } from "@/lib/store";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import toast from "react-hot-toast";
import ProductCard from "@/components/productCard";
import Image from "next/image";
import InstagramFeed from "@/components/InstagramFeed";

const ITEMS_PER_PAGE = 1;

export default function Home() {
  const { selectedCategory, selectedCategoryImage } = useStore();
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch products from Firestore
  const fetchProducts = async () => {
    setIsLoading(true);
    setProducts([]);
    setHasMore(true);
    setLastVisible(null);
    try {
      const productsCollection = collection(db, "products");

      let productsQuery;

      if (selectedCategory !== "1") {
        productsQuery = query(
          productsCollection,
          where("categoryId", "==", selectedCategory),
          limit(ITEMS_PER_PAGE),
          orderBy("createdAt", "desc")
        );
      } else {
        productsQuery = query(
          productsCollection,
          limit(ITEMS_PER_PAGE),
          orderBy("createdAt", "desc")
        );
      }

      const productSnapshot = await getDocs(productsQuery);

      if (productSnapshot.empty) {
        setHasMore(false);
        return;
      }

      const fetchedProducts = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(fetchedProducts);
      setLastVisible(productSnapshot.docs[productSnapshot.docs.length - 1]);
      setHasMore(fetchedProducts.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  // Load more products
  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const productsCollection = collection(db, "products");

      let productsQuery;

      if (selectedCategory !== "1") {
        productsQuery = query(
          productsCollection,
          where("categoryId", "==", selectedCategory),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(ITEMS_PER_PAGE)
        );
      } else {
        productsQuery = query(
          productsCollection,
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(ITEMS_PER_PAGE)
        );
      }

      const productSnapshot = await getDocs(productsQuery);

      if (productSnapshot.empty) {
        setHasMore(false);
        return;
      }

      const fetchedProducts = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts((prevProducts) => [...prevProducts, ...fetchedProducts]);
      setLastVisible(productSnapshot.docs[productSnapshot.docs.length - 1]);
      setHasMore(fetchedProducts.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error loading more products:", error);
      toast.error("Failed to load more products. Please try again.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  console.log(selectedCategoryImage?.id, "categoryImage")

  return (
    <div className="pb-16">
      <CategoriesNav />

      {selectedCategoryImage !== null && (
        <div className="w-full px-4 md:px-0">
          <div className="aspect-[8/2] relative  my-4">
            <Image
              src={selectedCategoryImage?.image}
              alt={"category image"}
              fill
              priority
              className="object-cover rounded-lg shadow-sm"
            />
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 aspect-[2/3] bg-gray-200 rounded-lg animate-pulse"
                >
                  <div className="w-full h-full flex justify-center items-center">
                    <p className="font-extrabold text-gray-300">SHEYONCE</p>
                  </div>
                </div>
              ))
            : products.map((product, index) => (
                <ProductCard product={product} key={index} />
              ))}
        </div>

        {products.length === 0 ? (
          <div className="text-center mt-16 space-y-4">
            <p className="text-gray-500 italic">No products found</p>
            <Button variant="outline" asChild>
              <Link href="https://wa.me/1234567890" className="text-xs">
                Can't find what you're looking for? Contact us
              </Link>
            </Button>
          </div>
        ) : hasMore ? (
          <div className="w-full flex justify-center items-center mt-16">
            <Button
              variant="outline"
              className="text-sm bg-black text-white rounded-full shadow-md"
              onClick={loadMore}
              disabled={isLoading}
            >
              {isLoadingMore ? <LoadingSpinner /> : "Load more"}
            </Button>
          </div>
        ) : (
          <div className="text-center mt-16  space-y-4">
            <p className="text-gray-500 text-xs italic">that's all for now</p>
            <Button variant="outline" asChild>
              <Link href="https://wa.me/1234567890" className="text-xs">
                Can't find what you're looking for? Contact us
              </Link>
            </Button>
          </div>
        )}
      </div>


      {/* instagram feed */}
      <InstagramFeed />
    </div>
  );
}
