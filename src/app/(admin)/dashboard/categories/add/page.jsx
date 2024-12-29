"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function AddCategoryPage() {
  const router = useRouter();
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newCategory.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      // Here you would typically send the new category data to your backend
      console.log("New category:", newCategory);
      // For now, we'll just show a success message and redirect
      alert("Category added successfully!");
      router.push("/dashboard/categories");
    } catch (err) {
      setError("Failed to add category. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/categories")}
              >
                Cancel
              </Button>
              <Button type="submit">Add Category</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
