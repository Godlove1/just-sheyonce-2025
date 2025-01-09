"use client"

import Image from "next/image";
import { MainMenu } from "./main-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Link from "next/link";
import { SearchDialog } from "./search-dialog";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { MiniCart } from "./mini-cart";

export default function Header() {

     const { cart, error, clearError } =
       useStore();
     const [isSearchOpen, setIsSearchOpen] = useState(false);

    const totalItems = cart.length;
    
  return (
    <>
      <header className="sticky top-0 z-50 bg-white ">
        <div className="flex items-center justify-between p-4">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <MainMenu />
            </SheetContent>
          </Sheet>

          <Link href="/" className="ml-8" title="sheyonce">
            <Image
              src="/logo.webp"
              alt="Sheyonce logo"
              width={80}
              height={80}
              className=""
            />
          </Link>

          <div className="flex items-center gap-y-4 gap-x-2">
            <button className="p-2" onClick={() => setIsSearchOpen(true)}>
              <Search className="w-6 h-6" />
            </button>
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 relative">
                  <ShoppingBag className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <MiniCart />
              </SheetContent>
            </Sheet>
          </div>
        </div>
          </header>
          

          {/* errors */}
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

      {/* search box */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
