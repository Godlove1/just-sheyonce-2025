"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "../../../../lib/store";
import { ImageCarousel } from "../../../../components/image-carousel";
import { LoadingSpinner } from "../../../../components/loading-spinner";
import NotFound from "../../../not-found";
import Link from "next/link";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { products, addToCart, setError } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("SM");
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(() => {
    if (params.id && products) {
      const foundProduct = products.find((p) => p.id.toString() === params.id);
      if (foundProduct) {
        setProduct(foundProduct);
        // Get suggested products (excluding the current product)
        const suggested = products
          .filter((p) => p.id !== foundProduct.id)
          .sort(() => 0.5 - Math.random()) // Shuffle array
          .slice(0, 8); // Get first 8 items
        setSuggestedProducts(suggested);
      } else {
        setNotFound(true);
      }
    }
  }, [params.id, products]);

  if (notFound) {
    return <NotFound />;
  }

  if (!product) {
    return (
      <>
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  const productName = product.name;
  const productDescription =
    product.description || `No description available for ${productName}.`;
  const productImage = product.image;
  const productPrice = product.price;

  const images = [productImage, productImage, productImage]; // Replace with actual multiple images when available

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart(product, quantity, color);
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/cart");
    } catch (error) {
      setError("Failed to add item to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4 pb-6">
        <ImageCarousel images={images} />
        <button
          className="absolute top-24 right-4 p-2 z-40 bg-white rounded-full shadow-lg"
          onClick={() => {
            const shareText = `Check out this ${productName} from Sheyonce!`;
            const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/product/${params.id}`;
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
          <h1 className="text-2xl font-bold">{productName}</h1>
          <p className="text-2xl">&#8355; {productPrice.toFixed(2)}</p>

          <div className="space-y-2 text-sm">
            <Label>Select Size : </Label>
            <RadioGroup
              value={color}
              onValueChange={setColor}
              className="flex flex-row gap-2 text-xs"
            >
              {["SM", "S", "X", "XL", "XXL"].map((colorOption) => (
                <Label
                  key={colorOption}
                  className="flex items-center text-xs gap-2 p-2 border rounded-lg cursor-pointer"
                >
                  <RadioGroupItem className="text-xs" value={colorOption} />
                  {colorOption}
                </Label>
              ))}
            </RadioGroup>
          </div>

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
                `Add ₣ ${(productPrice * quantity).toFixed(2)}`
              )}
            </Button>
          </div>

          {/* desc */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold mt-8">Description</h2>
            <p className="text-gray-600 text-xs">{productDescription}</p>
          </div>
        </div>

        <div className="mt-8 px-4">
          <h2 className="text-center font-bold my-6 mt-12">
            You may be interested
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {suggestedProducts.map((product) => (
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
                  <h3 className="font-medium group-hover:text-gray-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600">
                    {" "}
                    &#8355; {product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
