"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EditCategory({ id }) {
  const router = useRouter();
  const [categoryName, setCatName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(false);

  useEffect(() => {
    if (!id) return; // Wait for the `id` to be available before making the fetch request

    const fetchCategory = async () => {
      setLoading(true);
      try {
        const categoryRef = doc(db, "categories", id); // Create a reference to the category document
        const categorySnap = await getDoc(categoryRef); // Fetch the document

        if (categorySnap.exists()) {
          setCatName(categorySnap.data().name); // Set the category name
        } else {
          setError("Category not found");
          toast.error("Category not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load category");
        toast.error("Failed to load category");
      } finally {
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
      setAction(false);
      return;
    }

    try {
      const categoryRef = doc(db, "categories", id); // Create a reference to the category document
      await updateDoc(categoryRef, { name: categoryName }); // Update the document with the new name

      toast.success("Category updated successfully!");
      router.push("/dashboard/categories"); // Redirect after successful update
    } catch (err) {
      toast.error("Failed to update category");
      console.error("Failed to update category:", err.message);
    } finally {
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
                onChange={(e) => setCatName(e.target.value)} // Update state correctly
                placeholder="Enter category name"
                className="mt-2 mb-8 font-normal"
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
              <Button type="submit" disabled={action}>
                Update Category
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
