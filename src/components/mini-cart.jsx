"use client";

import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useStore } from "../lib/store";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";

export function MiniCart() {
  const { cart, removeFromCart, updateQuantity } = useStore();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <SheetHeader className="p-4 border-b">
        <SheetTitle>Your Cart ({cart.length})</SheetTitle>
      </SheetHeader>

      <ScrollArea className="flex-1">
        <div className="divide-y">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.selectedSize}`}
              className="p-4 flex gap-4"
            >
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={item?.images[0]}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium capitalize">{item.name}</h3>
                  <button
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Size: {item.selectedSize}
                </p>
                <p className="text-sm font-medium mt-1">
                  &#8355;{item.price.toLocaleString()}
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
      </ScrollArea>

      <div className="border-t p-4 space-y-4">
        <div className="flex justify-between text-lg font-medium">
          <span>Total</span>
          <span>&#8355;{total.toFixed(1)}</span>
        </div>
        <Link href="/checkout" className="block">
          <Button className="w-full" size="lg">
            Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}
