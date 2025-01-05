"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import axios from "axios";

export default function EditCategory({ id }) {
  const router = useRouter();
  const [categoryName, setCatName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(false);

  useEffect(() => {
    if (!id) return; // Wait for the `id` to be available before making the fetch request

    const fetchCategory = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`/api/categories/${id}`);
       
        console.log(res?.data?.name, "categoryData");
        setCatName(res?.data?.name);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load category");
        toast.error("Failed to load category");
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]); // Dependency on `id` to refetch when `id` changes

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAction(true);

    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

   try {
     const res = await toast.promise(
       axios.put(`/api/categories/${id}`, { name: categoryName }),
       {
         loading: "updating category...",
         success: "Category updated successfully!",
         error: "Failed to update category",
       }
     );
     console.log(res.data, "response");
     setAction(false);
     router.push("/dashboard/categories");
   } catch (err) {
     toast.error("Failed to update category");
     console.log("Failed to update category:", err.message);
     setAction(false);
   }
  };

  if (loading) return <p>Loading category...</p>;
  
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mt-4">
              <Label htmlFor="categoryName" className="text-xs">
                Category Name
              </Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCatName(e.target.value)}
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
              <Button type="submit" disabled={action}>Update Category</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
