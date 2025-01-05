"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
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
import toast from "react-hot-toast";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

   const fetchCategories = async () => {
     try {
       setLoading(true);
      const initialQuery = query(
        collection(db, "categories")
      );
       const DocsSnapshot = await getDocs(initialQuery);
       const dbData = DocsSnapshot.docs.map((doc) => ({
         ...doc.data(),
         id: doc.id, 
       }));
       console.log(dbData, "categories");
       setCategories(dbData);
     } catch (err) {
       console.error("Error fetching categories:", err);
       setError("Failed to fetch categories");
       toast.error("Failed to fetch categories");
     } finally {
       setLoading(false);
     }
   };

    fetchCategories();
  }, []);

 

  const columns = [
    // {
    //   accessorKey: "id",
    //   header: "ID",
    // },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div>
          <Link
            href={`/dashboard/categories/edit/${row.original.id}`}
            className="mr-2 text-xs flex-shrink-0 font-bold px-4 border p-2 shadow-md rounded-md hover:bg-black hover:text-white"
          >
            Edit
          </Link>
          {/* <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </Button> */}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleEdit = (id) => {
    router.push(`/dashboard/categories/edit/${id}`);
  };

  const handleDelete = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  // Render loading, error, or the categories list
  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="flex justify-between items-center mb-4 md:my-8">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button
          size="sm"
          onClick={() => router.push("/dashboard/categories/add")}
        >
          Add New Category
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Category List</CardTitle>
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
