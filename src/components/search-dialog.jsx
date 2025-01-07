"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase"; // Import Firestore
import { collection, query, where, onSnapshot } from "firebase/firestore"; // Import Firestore functions

export function SearchDialog({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Real-time search using Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "products"),
        where("name", ">=", searchQuery.toLowerCase()),
        where("name", "<=", searchQuery.toLowerCase() + "\uf8ff")
      ),
      (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSearchResults(results);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [searchQuery]);

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
          {searchResults.length > 0 ? (
            searchResults.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="flex items-center space-x-4"
                onClick={onClose}
              >
                <Image
                  src={product.images[0]}
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
            ))
          ) : (
            <p className="text-gray-500">No products found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
