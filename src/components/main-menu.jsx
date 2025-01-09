"use client";

import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Ghost,
  Instagram,
  PhoneIcon as WhatsApp,
} from "lucide-react";
import Link from "next/link";

export function MainMenu() {
  return (
    <div className="h-full flex flex-col">
      <SheetHeader className="p-4 border-b">
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>

      <div className="flex-1 p-4">
        <nav className="space-y-2">
          <Link href="/" className="block py-2 hover:text-gray-600">
            Home
          </Link>
          <Link href="/cart" className="block  hover:text-gray-600">
            Cart
          </Link>
        </nav>

        <div className="mt-8 pt-8 border-t">
          <h3 className="font-medium mb-4">Connect with us</h3>
          <div className="space-y-4">
            <a
              href="https://instagram.com/ssheyonce"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gray-600"
            >
              <Instagram className="w-5 h-5" />
              @ssheyonce
            </a>
            <a
              href="https://snapchat.com/add/sheyonce"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gray-600"
            >
              <Ghost className="w-5 h-5" />
              @sheyonce.store
            </a>
            <a
              href="https://wa.me/971525339438"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gray-600"
            >
              <WhatsApp className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
