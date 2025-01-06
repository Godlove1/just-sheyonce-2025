"use client";

import { useEffect, useState } from "react";
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
import ImagePreview from "@/components/imagePreview";
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import axios from "axios"; // Ensure axios is imported for image uploads
import { db } from "@/lib/firebase";

const SIZES = ["SM", "S", "M", "L", "XL", "XXL"];

export default function AddProductPage() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    hasSizes: false,
    sizes: [],
    images: [],
    status: "active",
  });

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const initialQuery = query(collection(db, "categories"));
        const DocsSnapshot = await getDocs(initialQuery);
        const dbData = DocsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCategories(dbData);
      } catch (err) {
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      toast.error("Maximum 3 files allowed");
      return;
    }
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Remove selected file
  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Handle category selection
  const handleCategoryChange = (value) => {
    const selectedCategory = categories.find((cat) => cat.name === value);
    if (selectedCategory) {
      setNewProduct({ ...newProduct, categoryId: selectedCategory.id });
    }
  };

  // Toggle size options
  const handleSizeToggle = () => {
    setNewProduct({ ...newProduct, hasSizes: !newProduct.hasSizes, sizes: [] });
  };

  // Handle size selection
  const handleSizeChange = (size) => {
    const updatedSizes = newProduct.sizes.includes(size)
      ? newProduct.sizes.filter((s) => s !== size)
      : [...newProduct.sizes, size];
    setNewProduct({ ...newProduct, sizes: updatedSizes });
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Unsigned");
      formData.append("folder", "sheyonceProducts");

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!newProduct.name || !newProduct.categoryId || !newProduct.price) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

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

      const Id = doc(collection(db, "products")).id;

      const productData = {
        id: Id,
        name: newProduct.name,
        price: parseInt(newProduct.price, 10),
        description: newProduct.description || "",
        categoryId: newProduct.categoryId,
        hasSizes: newProduct.hasSizes || false,
        sizes: newProduct.sizes || [],
        images: uploadedUrls,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: newProduct.status || "active",
      };

      console.log(productData, "product");

      // Create product
      await toast.promise(setDoc(doc(db, "products", Id), productData), {
        loading: "Creating product...",
        success: "Product created successfully!",
        error: "Failed to create product",
      });

      setIsSubmitting(false);

      setNewProduct({
        name: "",
        description: "",
        categoryId: "",
        price: "",
        hasSizes: false,
        sizes: [],
        images: [],
        status: "active",
      });
      setSelectedFiles([]);
      // router.push("/dashboard/products");
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.message || "Failed to create product");
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Categories are loading...</p>;

  return (
    <div className="max-w-2xl mx-auto md:mt-8">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mt-3">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={newProduct.name}
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
                className="text-sm h-12"
                type="number"
                value={newProduct.price}
                onChange={handleInputChange}
                placeholder="Enter product price"
                required
              />
            </div>

            {!loading && (
              <div>
                <Label htmlFor="category">Category</Label>
                <Select name="categoryId" onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category, index) => (
                      <SelectItem key={index} value={category?.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasSizes"
                checked={newProduct.hasSizes}
                onCheckedChange={handleSizeToggle}
              />
              <Label htmlFor="hasSizes">This product has multiple sizes?</Label>
            </div>

            {newProduct.hasSizes && (
              <div className="space-y-2 bg-gray-100 italic text-sm rounded-md">
                <Label className="pt-4 pb-3 px-4">Select Sizes</Label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <div
                      key={size}
                      className="flex items-center space-x-1 pb-3 px-1"
                    >
                      <Checkbox
                        id={`size-${size}`}
                        checked={newProduct.sizes.includes(size)}
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
                Description <span className="text-xs italic"> (optional)</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                className="text-sm h-12"
              />
            </div>

            <div>
              <label htmlFor="images">Images</label>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <ImagePreview files={selectedFiles} onRemove={handleRemoveFile} />

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mr-8 text-sm"
                onClick={() => router.push("/dashboard/products")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding product..." : "Add Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
