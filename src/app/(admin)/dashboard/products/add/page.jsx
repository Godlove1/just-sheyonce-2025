"use client";

import { useState } from "react";
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
import { CldUploadWidget } from "next-cloudinary";

const SIZES = ["SM", "S", "M", "L", "XL", "XXL"];

export default function AddProductPage() {
  const router = useRouter();
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    hasSizes: false,
    sizes: [],
    images: [],
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleCategoryChange = (value) => {
    setNewProduct({ ...newProduct, category: value });
  };

  const handleSizeToggle = () => {
    setNewProduct({ ...newProduct, hasSizes: !newProduct.hasSizes, sizes: [] });
  };

  const handleSizeChange = (size) => {
    const updatedSizes = newProduct.sizes.includes(size)
      ? newProduct.sizes.filter((s) => s !== size)
      : [...newProduct.sizes, size];
    setNewProduct({ ...newProduct, sizes: updatedSizes });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setNewProduct({
      ...newProduct,
      images: [...newProduct.images, ...imageUrls],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      // Here you would typically send the new product data to your backend
      console.log("New product:", newProduct);
      // For now, we'll just show a success message and redirect
      alert("Product added successfully!");
      router.push("/dashboard/products");
    } catch (err) {
      setError("Failed to add product. Please try again.");
    }
  };

  const [resource, setResource] = useState();

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

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                value={newProduct.category}
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

            <div className="flex items-center  space-x-2">
              <Checkbox
                id="hasSizes"
                checked={newProduct.hasSizes}
                onCheckedChange={handleSizeToggle}
              />
              <Label htmlFor="hasSizes">This product has multiple sizes?</Label>
            </div>

            {newProduct.hasSizes && (
              <div className="space-y-2 bg-gray-100 italic text-sm rounded-md">
                <Label className="pt-4 pb-3 px-4">select sizes</Label>
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
                Description <span className="text-xs italic"> (optional)</span>{" "}
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
              <CldUploadWidget
                signatureEndpoint="/api/sign-cloudinary-params"
                options={{
                  sources: ["local"],
                  multiple: true,
                  maxFiles: 3,
                  resourceType: "image",
                  folder: "sheyonce"
                }}
                onSuccess={(result, { widget }) => {
                  setResource(result?.info);
                  // { public_id, secure_url, etc }
                  console.log(result?.info, "files");
                 
                }}
                onQueuesEnd={(result, { widget }) => {
                  widget.close();
                }}
              >
                {({ open }) => {
                  function handleOnClick() {
                    setResource(undefined);
                    open();
                  }
                  return (
                    <button
                      onClick={handleOnClick}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none text-sm focus:ring focus:border-blue-300"
                    >
                      Upload product Images
                    </button>
                  );
                }}
              </CldUploadWidget>
            </div>

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
              <Button type="submit">Add Product</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
