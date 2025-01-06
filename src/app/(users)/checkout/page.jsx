"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useStore();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    toast.info("generating order request");

    const orderRef = doc(collection(db, "orders"));
    await setDoc(orderRef, {
      ...cart,
      total,
      orderId: orderRef.id,
    });

    // Create WhatsApp message
    const message =
      `New Order from ${formData.name}!\n\n` +
      `Items:\n${cart
        .map(
          (item) =>
            `- ${item.name} (${item.selectedSize}) x${item.quantity} - XAF${(
              item.price * item.quantity
            ).toLocaleString()}`
        )
        .join("\n")}\n\n` +
      `Total: $&#8355;{total.toFixed(2)}\n\n` +
      `Customer Details:\n` +
      `Name: ${formData.name}\n` +
      `Phone: ${formData.phone}\n` +
      `Address: ${formData.address}`;

    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);

    // Clear cart and redirect to WhatsApp
    clearCart();
    window.location.href = `https://wa.me/1234567890?text=${encodedMessage}`;
  };

  if (cart.length === 0) {
    router.push("/");
    return null;
  }

  console.log(cart, "cart");
  return (
    <>
      <div className="min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                placeholder="enter your name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="enter your phone number"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <Input
                id="address"
                required
                placeholder="enter your address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between text-lg font-medium mb-6">
              <span>Total</span>
              <span>XAF {total.toLocaleString()}</span>
            </div>

            <Button type="submit" className="w-full" size="lg" id="OrderButton">
              Complete Order on WhatsApp
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
