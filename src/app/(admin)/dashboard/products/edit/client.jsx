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
import ImagePreview from "@/components/imagePreview"; // Assuming you have an ImagePreview component
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore"; // Import Firestore functions
import { db } from "@/lib/firebase"; // Import your Firestore instance
import ImagePreviewEdit from "./imagePreview";

const SIZES = ["SM", "S", "M", "L", "XL", "XXL"];

export default function ClientEditProduct({ id }) {
  const router = useRouter();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    hasSizes: false,
    sizes: [],
    images: [], // This will hold both existing and new image URLs
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setProduct(productSnap.data());
        } else {
          console.error("No such product!");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, "categories");
        const categorySnapshot = await getDocs(categoriesCollection);
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryList);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCategoryChange = (value) => {
    const selectedCategory = categories.find((cat) => cat.name === value);
    if (selectedCategory) {
      setProduct({ ...product, categoryId: selectedCategory.id });
    }
  };

  const handleSizeToggle = () => {
    setProduct({ ...product, hasSizes: !product.hasSizes, sizes: [] });
  };

  const handleSizeChange = (size) => {
    const updatedSizes = product.sizes.includes(size)
      ? product.sizes.filter((s) => s !== size)
      : [...product.sizes, size];
    setProduct({ ...product, sizes: updatedSizes });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Check if the total number of images exceeds 3
    if (product.images.length + files.length > 3) {
      toast.error(
        "You can only upload a maximum of 3 images. Please remove some images first."
      );
      return;
    }

    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setProduct({ ...product, images: [...product.images, ...newImageUrls] });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!product.name || !product.categoryId || !product.price) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const productRef = doc(db, "products", id); // Get a reference to the product document
      await updateDoc(productRef, {
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        price: parseFloat(product.price), // Ensure price is a number
        hasSizes: product.hasSizes,
        sizes: product.sizes,
        images: product.images, // Use the updated images array
      });

      toast.success("Product updated successfully!");
      router.push("/dashboard/products");
    } catch (err) {
      setError("Failed to update product. Please try again.");
      console.error("Error updating product:", err);
    }
  };

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
                className="text-sm h-12"
                type="number"
                value={product.price}
                onChange={handleInputChange}
                placeholder="Enter product price"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                value={product.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
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
                <Label>Select Sizes</Label>
                <div className="flex flex-wrap gap-2">
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
                Description <span className="text-xs italic"> (optional)</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                className="text-sm h-12"
              />
            </div>

            <div>
              <Label htmlFor="images">New Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                onChange={handleImageUpload}
                accept="image/*"
              />
            </div>

            <ImagePreviewEdit files={product.images} onRemove={handleRemoveImage} />

            {error && <p className="text-red-500 my-2 text-sm">{error}</p>}
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
              <Button type="submit">Update Product</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
