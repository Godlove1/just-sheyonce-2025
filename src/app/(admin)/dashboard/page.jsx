"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShoppingBag, Tag, DollarSign, ShoppingCart } from "lucide-react";

export default function DashboardPage() {
  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCounts = async () => {
      try {
        setLoading(true);
        // Get products count
        const productsSnapshot = await getCountFromServer(
          collection(db, "products")
        );

        // Get categories count
        const categoriesSnapshot = await getCountFromServer(
          collection(db, "categories")
        );

        setCounts({
          products: productsSnapshot.data().count,
          categories: categoriesSnapshot.data().count,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    getCounts();
  }, []);

  const stats = [
    // {
    //   title: "Total Sales",
    //   value: "$12,345",
    //   icon: DollarSign,
    // },
    // {
    //   title: "Orders",
    //   value: "123",
    //   icon: ShoppingCart,
    // },
    {
      title: "Products",
      value: counts.products,
      icon: ShoppingBag,
      isLoading: loading,
    },
    {
      title: "Categories",
      value: counts.categories,
      icon: Tag,
      isLoading: loading,
    },
  ];

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {stat.isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-[100px]" />
                </div>
              ) : (
                <p className="text-2xl font-bold">{stat.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
