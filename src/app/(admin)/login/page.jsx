"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAdminUser = useStore((state) => state.setAdminUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
    const response = await fetch("/api/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Display server-provided error message
      toast.error(result.message || "An error occurred. Please try again.");
      return;
    }

    // Success: store user and navigate to dashboard
      setAdminUser(result.data);
      
      console.log(result.data, "userInfo")
      // setAdminUser(user); // Store the user in Zustand
      // router.push("/dashboard");
      setIsLoading(false)

    } catch (err) {
      // toast.error("An error occurred. Please try again.");
      console.log(err,"error")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="w-full flex justify-center items-center">
            <Image
              src={"/logo.png"}
              width={100}
              height={100}
              unoptimized
              alt="logo"
              className=""
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <div className="mt-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
            </div>
          
            <div className="w-full flex justify-center mt-6 items-center">
              <Button
                className="w-1/2 rounded-full border shadow-md hover:bg-white hover:text-black hover:border-black"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* back to website */}
      <div className="w-full flex justify-center items-center mt-6">
        <div className="w-1/2 mt-6 flex justify-start ">
          <Link href={'/'} title="bact to home" className="text-sm underline flex items-center justify-start">
            <ArrowBigLeft className="w-5 h-5" /> bact to website
          </Link>
        </div>
      </div>
    </div>
  );
}
