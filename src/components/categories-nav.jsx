"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "../lib/store";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase"; // Import Firestore
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions

export function CategoriesNav() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const scrollRef = useRef(null);
  const { selectedCategory, setSelectedCategory, setSelectedCategoryImage } = useStore();

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, "categories");
      const categorySnapshot = await getDocs(categoriesCollection);
      const fetchedCategories = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
       
        ...doc.data(),
      })); // Assuming each category document has a 'name' field
      setCategories([{id:"1",name: "All"}, ...fetchedCategories]);
      // console.log(fetchCategories, "cats")
      setLoading(false); // Set loading to false after fetching
    };

    fetchCategories();
  }, []);

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
          className="flex gap-4 overflow-x-auto py-4 scrollbar-hide px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading
            ? // Skeleton loading state
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-20 h-8 bg-gray-200 animate-pulse rounded"
                />
              ))
            : categories?.map((category) => (
                <button
                  key={category?.id}
                onClick={() => {
                  setSelectedCategory(category?.id);
                  if(category?.id !== "1") {
                    setSelectedCategoryImage({
                      image: category?.catImage[0],
                      id: category?.id,
                    });
                  } else {
                    setSelectedCategoryImage(null);
                  }
                
                  }}
                  className={`flex-shrink-0 text-[.8rem] capitalize 
                  ${
                    selectedCategory === category?.id
                      ? "underline font-bold text-black "
                      : " text-gray-900 hover:underline"
                  }`}
                >
                  {category?.name} 
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
