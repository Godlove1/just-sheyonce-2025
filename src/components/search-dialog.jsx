import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useStore } from "../lib/store";
import Link from "next/link";
import Image from "next/image";

export function SearchDialog({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { products } = useStore();

  useEffect(() => {
    if (searchQuery && products) {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4"
        />
        <div className="space-y-4 max-h-[300px] overflow-y-auto">
          {searchResults.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex items-center space-x-4"
              onClick={onClose}
            >
              <Image
                src={product.image}
                alt={product.name}
                width={50}
                height={50}
                className="rounded-md"
              />
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500">
                  &#8355;{product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
