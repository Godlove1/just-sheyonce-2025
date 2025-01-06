"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useStore();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item?.selectedSize}`}
              className="flex gap-4 p-4 border rounded-lg"
            >
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item?.images[0] || "/logo.png"}
                  alt={item?.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium capitalize">{item?.name}</h3>
                  <button
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Size: {item.selectedSize}
                </p>
                <p className="text-sm font-medium mt-1">
                  &#8355;{item.price.toFixed(0)}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.selectedSize,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.selectedSize,
                        item.quantity + 1
                      )
                    }
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex justify-between text-lg font-medium">
            <span>Total</span>
            <span>&#8355;{total.toFixed(0)}</span>
          </div>

          <Button asChild className="w-full" size="lg">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
