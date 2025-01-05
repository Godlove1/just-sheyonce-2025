"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import {  ArrowLeft } from "lucide-react";
import axios from "axios";

export default function AddCategoryPage() {
  const router = useRouter();
  const [newCategory, setNewCategory] = useState("");
  const [isAction, setIsAction] = useState(false)
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newCategory.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsAction(true)

   try {
     const res = await toast.promise(
       axios.post("/api/categories", { name: newCategory }),
       {
         loading: "Creating category...",
         success: "Category created successfully!",
         error: "Failed to create category",
       }
     );
     console.log(res.data, "response");
     setNewCategory("")
setIsAction(false);
   } catch (err) {
     console.log(err, "ERROR");
     toast.error("Failed to add category. Please try again.");
     setIsAction(false);
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
               <ArrowLeft /> go back
              </Button>
              <Button type="submit" disabled={isAction}>Add Category</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
