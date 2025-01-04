"use client";

import { useState } from "react";
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

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([
    { id: 1, name: "Classic T-Shirt", category: "T-Shirts", price: 29.99 },
    { id: 2, name: "Slim Fit Jeans", category: "Jeans", price: 59.99 },
    { id: 3, name: "Summer Dress", category: "Dresses", price: 49.99 },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `F ${row.original.price.toFixed(2)}`,
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

 
  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

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
      <Card>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
