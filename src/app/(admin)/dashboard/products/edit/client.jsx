"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import ImagePreviewEdit from "./imagePreview";
import axios from "axios";

const SIZES = ["SM", "S", "M", "L", "XL", "XXL"];

export default function EditProductForm({ productId }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    hasSizes: false,
    sizes: [],
    images: [],
    newImageFiles: [],
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productSnap, categorySnap] = await Promise.all([
          getDoc(doc(db, "products", productId)),
          getDocs(collection(db, "categories")),
        ]);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          setProduct({
            ...productData,
            images: Array.isArray(productData.images) ? productData.images : [],
            newImageFiles: [],
          });
        } else {
          throw new Error("Product not found");
        }

        setCategories(
          categorySnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error(err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) fetchData();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    const selectedCategory = categories.find((cat) => cat.name === value);
    if (selectedCategory) {
      setProduct((prev) => ({ ...prev, categoryId: selectedCategory.id }));
    }
  };

  const handleSizeToggle = () => {
    setProduct((prev) => ({ ...prev, hasSizes: !prev.hasSizes, sizes: [] }));
  };

  const handleSizeChange = (size) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Unsigned");
    formData.append("folder", "sheyonceProducts");

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Validate total number of images
    if (product.images.length + files.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    // Validate file types
    const invalidFiles = files.filter(
      (file) => !file.type.startsWith("image/")
    );
    if (invalidFiles.length > 0) {
      toast.error("Please select only image files");
      return;
    }

    const newImageUrls = files.map((file) => URL.createObjectURL(file));

    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...newImageUrls],
      newImageFiles: [...prev.newImageFiles, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      newImageFiles: prev.newImageFiles.filter((_, i) => i !== index),
    }));
  };

 const handleSubmit = async (e) => {
   e.preventDefault();
   setIsSubmitting(true);
   setError("");

   try {
     if (!product.name.trim()) throw new Error("Product name is required");
     if (!product.categoryId) throw new Error("Please select a category");
     if (!product.price || parseFloat(product.price) <= 0) {
       throw new Error("Please enter a valid price");
     }
     if (product.hasSizes && product.sizes.length === 0) {
       throw new Error("Please select at least one size");
     }
     if (product.images.length === 0) {
       throw new Error("Please add at least one product image");
     }

     // Initialize finalImages with existing Cloudinary URLs
     let finalImages = product.images.slice(
       0,
       product.images.length - product.newImageFiles.length
     );

     // Upload new images if any
     if (product.newImageFiles.length > 0) {
       const uploadedUrls = await toast.promise(
         Promise.all(product.newImageFiles.map(uploadToCloudinary)),
         {
           loading: "Uploading images...",
           success: "Images uploaded successfully!",
           error: "Failed to upload images",
         }
       );

       // Combine existing URLs with newly uploaded URLs
       finalImages = [...finalImages, ...uploadedUrls];
     }

    //  const obj = {
    //    name: product.name.trim(),
    //    description: product.description.trim(),
    //    categoryId: product.categoryId,
    //    price: parseFloat(product.price),
    //    hasSizes: product.hasSizes,
    //    sizes: product.sizes,
    //    images: finalImages,
    //    updatedAt: new Date().toISOString(),
    //  };

    //  console.log(obj, 'object')

     // Update product in Firestore
     await updateDoc(doc(db, "products", productId), {
       name: product.name.trim(),
       description: product.description.trim(),
       categoryId: product.categoryId,
       price: parseFloat(product.price),
       hasSizes: product.hasSizes,
       sizes: product.sizes,
       images: finalImages,
       updatedAt: new Date().toISOString(),
     });

     toast.success("Product updated successfully!");
    //  router.push("/dashboard/products");
   } catch (err) {
     console.error("Update failed:", err);
     toast.error(err.message);
     setError(err.message);
   } finally {
     setIsSubmitting(false);
   }
 };

  if (isLoading) {
    return <p>Loading product...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto md:mt-8">
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mt-3">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                className="text-sm h-12"
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={product.price}
                onChange={handleInputChange}
                placeholder="Enter product price"
                className="text-sm h-12"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={
                  categories.find((cat) => cat.id === product.categoryId)?.name
                }
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasSizes"
                checked={product.hasSizes}
                onCheckedChange={handleSizeToggle}
              />
              <Label htmlFor="hasSizes">This product has multiple sizes</Label>
            </div>

            {product.hasSizes && (
              <div className="space-y-2">
                <Label>Available Sizes</Label>
                <div className="flex flex-wrap gap-4">
                  {SIZES.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={product.sizes.includes(size)}
                        onCheckedChange={() => handleSizeChange(size)}
                      />
                      <Label htmlFor={`size-${size}`}>{size}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="description">
                Description{" "}
                <span className="text-xs text-gray-500">(optional)</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                className="min-h-[100px] text-sm"
              />
            </div>

            <div>
              <Label htmlFor="images">
                Product Images{" "}
                <span className="text-xs text-gray-500">(max 3)</span>
              </Label>
              <Input
                id="images"
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="h-12"
              />
            </div>

            {product.images.length > 0 && (
              <ImagePreviewEdit
                files={product.images}
                onRemove={handleRemoveImage}
              />
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mr-8"
                onClick={() => router.push("/dashboard/products")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
