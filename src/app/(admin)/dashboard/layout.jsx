"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  LogOut,
Settings,
  UserCircle
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Tag, label: "Categories", href: "/dashboard/categories" },
  { icon: ShoppingBag, label: "Products", href: "/dashboard/products" },
  // { icon: ShoppingCart, label: "Orders", href: "/dashboard/orders" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState({
    name: "John Doe",
    image: "/placeholder-user.jpg",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen bg-gray-100 ">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="p-4 w-full flex justify-center items-center">
            <Image
              src={"/logo.png"}
              width={100}
              height={100}
              alt="Admin"
              className=""
            />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="p-4">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    active={pathname === item.href ? "true" : undefined}
                    className={`${pathname === item.href ? "bg-black text-white hover:bg-white hover:text-black border-2" : ''}`}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-2 "
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <div className="mt-auto p-4">
            <Button
              variant="outline"
              className="w-full rounded-full bg-black text-white hover:bg-white hover:text-black"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-2 sm:px-3 lg:px-8 flex items-center justify-between">
              <div className="flex items-center">
                <SidebarTrigger
                  className="lg:hidden mr-3"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <h1 className="text-2xl font-extrabold">Sheyonce</h1>
              </div>
              <div className="flex items-center ">
                <span className="">{admin.name}</span>
                <Link
                  href="/dashboard/profile"
                  className="w-6 h-6 flex justify-center items-center  border-2 border-black rounded-full ml-2 bg-black text-white hover:bg-white hover:text-black"
                >
                  <UserCircle className="text-xs " />
                </Link>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto py-4 sm:px-4 lg:px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
