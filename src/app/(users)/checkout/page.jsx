"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendGAEvent } from "@next/third-parties/google";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useStore();
  const [isAction, setIsAction] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsAction(true)
    toast("Generating order request...");

    try {
      // Save order to Firestore
      const orderRef = doc(collection(db, "orders"));
      await setDoc(orderRef, {
        ...cart,
        total,
        orderId: orderRef.id,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        createdAt: new Date().toISOString(),
      });

      toast.success("Order saved successfully!");

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
        `Total: XAF ${total.toLocaleString()}\n\n` +
        `Customer Details:\n` +
        `Name: ${formData.name}\n` +
        `Phone: ${formData.phone}\n` +
        `Address: ${formData.address}`;

      // Encode message for WhatsApp URL
      const encodedMessage = encodeURIComponent(message);

      // Clear cart
      clearCart();

      setIsAction(false)
      // Redirect to WhatsApp
      // Create a link and trigger a click
      const link = document.createElement("a");
      link.href = `https://wa.me/971525339438?text=${encodedMessage}`;
      link.target = "_blank"; // Open in a new tab
      link.click();

      // console.log(encodedMessage, "message");
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Failed to save order. Please try again.");
    }
  };

  if (cart.length === 0) {
    router.push("/");
    return null;
  }

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
                className="h-12"
                required
                value={formData.name}
                placeholder="Enter your name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                className="h-12"
                placeholder="Enter your phone number"
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
              <textarea
                id="address"
                required
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full p-2 border rounded-md resize-y min-h-[100px]"
              />
            </div>

            <div className="w-full flex justify-center items-center">
              <div>
                <Input
                  className="h-12"
                  placeholder="COUPON CODE"
                  type="text"
                 disabled
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between text-lg font-medium mb-6">
              <span>Total</span>
              <span>XAF {total.toLocaleString()}</span>
            </div>

            <Button
              onClick={() =>
                sendGAEvent("event", "buttonClicked", { value: "Order button" })
              }
              type="submit"
              className="w-full"
              size="lg"
              id="OrderButton"
              disabled={isAction}
            >
              {isAction ? "Generating order..." : "Complete Order on WhatsApp"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
