"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "../lib/store";
import { Button } from "@/components/ui/button";

export function CategoriesNav({ categories }) {
  const scrollRef = useRef(null);
  const { selectedCategory, setSelectedCategory } = useStore();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-[73px] bg-white border-b z-40">
      <div className="flex items-center justify-between px-1">
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 border p-1 rounded-full shadow-sm text-black"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="w-2 h-2" />
        </Button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto py-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {["all", ...categories].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 text-xs  
                ${
                  selectedCategory === category
                    ? "underline font-bold text-black "
                    : " text-gray-900 hover:underline"
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 border p-1 rounded-full shadow-sm text-black"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="w-2 h-2" />
        </Button>
      </div>
    </div>
  );
}
