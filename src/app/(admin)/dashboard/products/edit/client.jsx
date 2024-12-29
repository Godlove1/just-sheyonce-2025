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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SIZES = ["SM", "S", "M", "L", "XL", "XXL"];

export default function ClientEditProduct({ initialProduct }) {
    
    const id = 1;
  const router = useRouter();

  const [product, setProduct] = useState({
    name: "Classic T-Shirt" || "",
    description:"A comfortable and stylish t-shirt" || "",
    category: "T-Shirts" || "",
    price: 299 || "",
    hasSizes: false,
    sizes: [],
    images: [],
  });

  const [error, setError] = useState("");

  useEffect(() => {
    // In a real application, you would fetch the product data from your API
    // For this example, we'll use mock data
    const mockProduct = {
      id: id,
      name: "Classic T-Shirt",
      description: "A comfortable and stylish t-shirt",
      category: "T-Shirts",
      price: "29.99",
      hasSizes: true,
      sizes: ["S", "M", "L"],
      images: ["/1.jpg"],
    };
    setProduct(mockProduct);
  }, [id]);
    

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCategoryChange = (value) => {
    setProduct({ ...product, category: value });
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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setProduct({ ...product, images: [...product.images, ...imageUrls] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!product.name || !product.category || !product.price) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      // Here you would typically send the updated product data to your backend
      console.log("Updated product:", product);
      // For now, we'll just show a success message and redirect
      alert("Product updated successfully!");
      router.push("/dashboard/products");
    } catch (err) {
      setError("Failed to update product. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
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
                className="text-sm"
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                className="text-sm"
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
                  <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                  <SelectItem value="Jeans">Jeans</SelectItem>
                  <SelectItem value="Dresses">Dresses</SelectItem>
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
                Description <span className="text-xs italic"> (optional)</span>{" "}
              </Label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                className="text-sm"
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
            {product.images.length > 0 && (
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                ))}
              </div>
            )}

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
