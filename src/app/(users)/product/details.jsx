"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, limit } from "firebase/firestore";
import toast from "react-hot-toast";
import NotFound from "@/app/not-found";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ImageCarousel } from "@/components/image-carousel";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/productCard";

export default function ProductDetailPage({ id }) {
  const router = useRouter();
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("SM");
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const productRef = doc(db, "products", id); // Create a reference to the product document
          const productPromise = getDoc(productRef); // Fetch the product document

          // Fetch suggested products
          const suggestedProductsRef = collection(db, "products");
          const suggestedProductsPromise = getDocs(
            suggestedProductsRef,
            limit(6)
          ); // Fetch suggested products

          // Wait for both promises to resolve
          const [productSnap, suggestedProductSnap] = await Promise.all([
            productPromise,
            suggestedProductsPromise,
          ]);

          if (productSnap.exists()) {
            setProduct(productSnap.data()); // Set the product data
            console.log(productSnap.data(), "product");
          } else {
            toast.error("Product not found");
            setNotFound(true);
            return; // Exit if product is not found
          }

          // Set suggested products
          const fetchedSuggestedProducts = suggestedProductSnap.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );
          setSuggestedProducts(fetchedSuggestedProducts);
        } catch (err) {
          console.error(err);
          toast.error("Failed to load product");
        } finally {
          setIsLoading(false);
        }
      } else {
        setNotFound(true);
      }
    };

    fetchProduct();
  }, [id]);

  if (notFound) {
    return <NotFound />;
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart(product, quantity, size);
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/cart");
    } catch (error) {
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-6 mb-16">
      <ImageCarousel images={product?.images} /> 
      <button
        className="absolute top-24 right-4 p-2 z-40 bg-white rounded-full shadow-lg"
        onClick={() => {
          const shareText = `Check out this ${product?.name} from Sheyonce!`;
          const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/product/${id}`;
          if (navigator.share) {
            navigator.share({
              title: shareText,
              url: shareUrl,
            });
          } else {
            // Fallback for browsers that don't support Web Share API
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                shareText
              )}&url=${encodeURIComponent(shareUrl)}`,
              "_blank"
            );
          }
        }}
      >
        <Share2 className="w-6 h-6" />
      </button>

      <div className="px-4 space-y-4">
        <h1 className="text-2xl font-bold capitalize">{product?.name}</h1>
        <p className="text-2xl">&#8355; {product?.price.toLocaleString()}</p>

        {product?.hasSizes && product?.sizes.length > 0 && (
          <div className="space-y-2 text-sm">
            <Label>Select Size : </Label>
            <RadioGroup
              value={size}
              onValueChange={setSize}
              className="flex flex-row gap-2 text-xs"
            >
              {product?.sizes.map((sizeOption) => (
                <Label
                  key={sizeOption}
                  className="flex items-center text-xs gap-2 p-2 border rounded-lg cursor-pointer"
                >
                  <RadioGroupItem className="text-xs" value={sizeOption} />
                  {sizeOption}
                </Label>
              ))}
            </RadioGroup>
          </div>
        )}

        <div className="space-y-2 ">
          <Label className="text-sm mt-2">Quantity : </Label>
          <div className="flex items-center my-4">
            <Button
              variant="outline"
              size="icon"
              className="focus:bg-black focus:text-white"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <span className="w-12 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="focus:bg-black focus:text-white"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
        </div>

        {/* add to cart */}
        <div className="w-full flex justify-center items-center">
          <Button
            className="w-1/2 mt-2 rounded-full font-bold "
            size="lg"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner className="text-white" />
            ) : (
              `Add XAF ${(product?.price * quantity).toLocaleString()}`
            )}
          </Button>
        </div>

        {/* desc */}
        {product?.description && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold mt-8">Description</h2>
            <p className="text-gray-600 text-xs">{product?.description}</p>
          </div>
        )}
      </div>

      <div className="mt-8 px-4">
        <h2 className="text-center font-bold my-6 mt-12">
          You may be interested
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {suggestedProducts.map((suggestedProduct, index) => (
            <ProductCard key={index} product={suggestedProduct} />
          ))}
        </div>
      </div>
    </div>
  );
}
