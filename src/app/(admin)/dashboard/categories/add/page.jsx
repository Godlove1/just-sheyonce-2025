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
import ImagePreview from "@/components/imagePreview";
import axios from "axios";


export default function AddCategoryPage() {
  const router = useRouter();
  const [newCategory, setNewCategory] = useState("");
  const [isAction, setIsAction] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 1) {
      toast.error("Maximum 1 files allowed");
      return;
    }
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Remove selected file
  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Unsigned");
      formData.append("folder", "sheyonceCategories");

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      return res?.data?.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newCategory.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsAction(true);

    try {
      // Upload images first with a toast
      const uploadImagesPromise = Promise.all(
        selectedFiles.map((file) => uploadToCloudinary(file))
      );

      const uploadedUrls = await toast.promise(uploadImagesPromise, {
        loading: "Uploading images...",
        success: "Images uploaded successfully!",
        error: "Failed to upload images",
      });

      // Create a new document reference with a unique ID
      const categoryRef = doc(collection(db, "categories")); // Get a reference to the new document
      await setDoc(categoryRef, {
        name: newCategory,
        catImage: uploadedUrls,
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
              <Label htmlFor="categoryName" className="p-2">
                Category Name
              </Label>
              <Input
                id="categoryName"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="md:mt-4">
              <Label htmlFor="categoryName">Category Image</Label>
              <Input
                id="categoryImage"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                required
              />
            </div>

            <ImagePreview files={selectedFiles} onRemove={handleRemoveFile} />

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
