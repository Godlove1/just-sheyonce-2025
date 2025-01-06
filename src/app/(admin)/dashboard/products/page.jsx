"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { TrashIcon } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setLoading(true);
        const productsQuery = query(collection(db, "products"));
        const categoriesQuery = query(collection(db, "categories"));
        
        const [productsSnapshot, categoriesSnapshot] = await Promise.all([
          getDocs(productsQuery),
          getDocs(categoriesQuery),
        ]);

        const dbProducts = productsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const dbCategories = categoriesSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setProducts(dbProducts);
        setCategories(dbCategories);
      } catch (err) {
        setError("Failed to fetch products or categories");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const categoryMap = categories.reduce((acc, category) => {
    acc[category.id] = category.name;
    return acc;
  }, {});

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "categoryId",
      header: "Category",
      cell: ({ row }) => categoryMap[row.original.categoryId] || "Unknown",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `F ${row.original.price.toLocaleString()}`,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="w-full flex items-center gap-x-1">
          <Link
            href={`/dashboard/products/edit/${row.original.id}`}
            className="mr-2 text-xs flex-shrink-0 font-bold px-4 border p-2 shadow-md rounded-md hover:bg-black hover:text-white"
          >
            Edit
          </Link>
          <Button
            variant="ghost"
            className="text-xs text-red-500 flex-shrink-0 border-none"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            <TrashIcon />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleDelete = async (id) => {

    try {
       const couponRef = doc(db, "products", id);
      await toast.promise(deleteDoc(couponRef), {
        // Use deleteDoc instead of setDoc
        loading: "Deleting products...",
        success: "deleted successfully!",
        error: "Failed to delete.",
      });

       setProducts(products.filter((p) => p.id !== id));
      
    } catch (err) {
      console.log(err, "Error deleting product")
    }
   
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-4 md:my-8">
        <h2 className="text-xl font-semibold">Products</h2>
        <Button
          size="sm"
          onClick={() => router.push("/dashboard/products/add")}
        >
          Add New Product
        </Button>
      </div>
      < Card>
        <CardHeader>
          <CardTitle className="text-lg">Product List</CardTitle>
          <Input
            placeholder="Search products..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm text-sm"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-4">
            <div>
              <span>
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </Button>
              <Button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </Button>
              <Button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {">"}
              </Button>
              <Button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
} 