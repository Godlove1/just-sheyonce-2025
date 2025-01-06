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
import ImagePreviewEdit from "../../products/edit/imagePreview";
import axios from "axios";

export default function EditCategoryForm({ categoryId }) {
  const router = useRouter();
  const [category, setCategory] = useState({
    name: "",
    images: [], // Keep as array for compatibility but will only contain one image
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const categoryRef = doc(db, "categories", categoryId);
        const categorySnap = await getDoc(categoryRef);

        if (categorySnap.exists()) {
          const categoryData = categorySnap.data();
          setCategory({
            name: categoryData.name,
            images: Array.isArray(categoryData.catImage)
              ? categoryData.catImage
              : [categoryData.catImage], // Ensure images is always an array
          });
        } else {
          throw new Error("Category not found");
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Create URL for preview
    const imageUrl = URL.createObjectURL(file);
    setCategory((prev) => ({
      ...prev,
      images: [imageUrl], // Replace existing image with new one
      newImageFile: file, // Store the actual file for upload
    }));
  };

  const handleRemoveImage = () => {
    setCategory((prev) => ({
      ...prev,
      images: [],
      newImageFile: null,
    }));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Unsigned");
    formData.append("folder", "sheyonceCategories");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!category.name.trim()) {
        throw new Error("Category name is required");
      }

      let imageUrl = category.images[0]; // Use existing image by default

      // Only upload new image if one was selected
      if (category.newImageFile) {
        imageUrl = await toast.promise(
          uploadToCloudinary(category.newImageFile),
          {
            loading: "Uploading image...",
            success: "Image uploaded successfully!",
            error: "Failed to upload image",
          }
        );
      }

      // Update category in Firestore
      const categoryRef = doc(db, "categories", categoryId);
      await updateDoc(categoryRef, {
        name: category.name,
        catImage: [imageUrl], // Store as array with single image
      });

      toast.success("Category updated successfully!");
      router.push("/dashboard/categories");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err.message);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p>Loading category...</p>;
  }

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
                value={category.name}
                onChange={(e) =>
                  setCategory((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter category name"
                className="mt-2 mb-8 font-normal"
              />
            </div>

            <div className="md:mt-4">
              <Label htmlFor="categoryImage">Category Image</Label>
              <Input
                id="categoryImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2"
              />
            </div>

            {category.images.length > 0 && (
              <ImagePreviewEdit
                files={category.images}
                onRemove={handleRemoveImage}
              />
            )}

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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Category"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
