"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default async function EditCategoryPage({ params }) {
  const router = useRouter();
  const { id } = await params;
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // In a real application, you would fetch the category data from your API
    // For this example, we'll use mock data
    setCategory("T-Shirts");
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!category.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      // Here you would typically send the updated category data to your backend
      console.log("Updated category:", category);
      // For now, we'll just show a success message and redirect
      alert("Category updated successfully!");
      router.push("/dashboard/categories");
    } catch (err) {
      setError("Failed to update category. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mt-4">
              <Label htmlFor="categoryName" className="text-xs">Category Name</Label>
              <Input
                id="categoryName"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category name"
                className="mt-2 mb-8 font-normal "
              />
            </div>
            {error && <p className="text-red-500 my-3 text-sm">{error}</p>}
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mr-8"
                onClick={() => router.push("/dashboard/categories")}
              >
                Cancel
              </Button>
              <Button type="submit">Update Category</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
