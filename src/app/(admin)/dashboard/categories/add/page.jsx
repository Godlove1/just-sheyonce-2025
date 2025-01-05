"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "@/lib/firebase";


export default function AddCategoryPage() {
  const router = useRouter();
  const [newCategory, setNewCategory] = useState("");
  const [isAction, setIsAction] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newCategory.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsAction(true);

    try {
      // Create a new document reference with a unique ID
      const categoryRef = doc(collection(db, "categories")); // Get a reference to the new document
      await setDoc(categoryRef, {
        name: newCategory,
        status: true,
        id: categoryRef.id,
      }); // Set the document data

      setNewCategory(""); // Clear the input field
      toast.success("Category added successfully.");
      router.push("/dashboard/categories"); // Redirect to the categories page
    } catch (err) {
      console.error(err, "ERROR");
      toast.error("Failed to add category. Please try again.");
    } finally {
      setIsAction(false); // Reset action state
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="md:mt-6">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/categories")}
              >
                <ArrowLeft /> Go Back
              </Button>
              <Button type="submit" disabled={isAction}>
                Add Category
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
